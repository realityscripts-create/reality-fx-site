#!/usr/bin/perl
use strict;
use warnings;

# CHAPTER FORGE STANDARD verifier (see CHAPTER-FORGE-STANDARD.md)
#
# A real structural parse: a string-aware bracket scan finds every top-level
# object in data.js and its exact span. Chapters are the spans that declare
# `id: N, title:`. Each chapter is then validated per lane:
#   - standard / challenging / elite each declare slides + quizSlides that must
#     match their native array and quiz entries exactly;
#   - every quiz entry carries an explain (Forge Standard 5);
#   - every content slide carries lead + body, every pause/close slide carries
#     body (Forge Standard 1).
#
# History: the original checker captured blocks with a 2-space-indent regex
# that stopped matching when chapters 1-11 were reformatted to 4-space indent
# — it silently validated one merged blob. This version derives spans from the
# actual brace structure, so indentation and line endings cannot break it.

open my $f, '<:raw', 'REALITY-FOREX-TRADING-/os/js/data.js' or die "data: $!";
my $raw = do { local $/; <$f> };
close $f;
$raw =~ s/\r\n/\n/g;   # mixed line endings in this file — normalise
$raw =~ s/\r/\n/g;

# ---------- structural scan: every depth-2 object span ----------------------
# data.js's data arrays sit at depth 1 (const X = [ ... ]), so each record is
# a depth-2 object: open = { that brings depth to 2, close = } that returns to 1.
sub scan_spans {
  my ($s) = @_;
  my @spans; my @opens; my $depth = 0; my $in_str = 0;
  for (my $i = 0; $i < length($s); $i++) {
    my $c = substr($s, $i, 1);
    if ($in_str) {
      if ($c eq '\\') { $i++; next; }
      $in_str = 0 if $c eq '"';
      next;
    }
    if ($c eq '"') { $in_str = 1; next; }
    if ($c eq '{') { $depth++; push @opens, $i if $depth == 2; next; }
    if ($c eq '}') {
      if ($depth == 2 && @opens) { push @spans, [pop(@opens), $i]; }
      $depth--; next;
    }
    if ($c eq '[') { $depth++; next; }
    if ($c eq ']') { $depth--; next; }
  }
  return \@spans, $depth;
}

my ($spansRef, $finalDepth) = scan_spans($raw);
my @spans = @$spansRef;
my @chapters;   # [id, title, span-open, span-close, blocktext]
for my $sp (@spans) {
  my $text = substr($raw, $sp->[0], $sp->[1] - $sp->[0] + 1);
  next unless $text =~ /^[ \t]*\{?[ \t]*id: (\d+), title: "([^"]+)"/m;
  push @chapters, [$1, $2, $sp->[0], $sp->[1], $text];
}
@chapters = sort { $a->[0] <=> $b->[0] } @chapters;

print "structure: ", scalar(@spans), " top-level records, depth returns to $finalDepth\n";
if ($finalDepth != 0) {
  print "!! UNBALANCED BRACKETS — the file does not close cleanly. Fix before anything else.\n";
}

my $fail = 0;
my %found = map { $_->[0] => 1 } @chapters;
for my $id (1..13) {
  unless ($found{$id}) { print "ch$id: BLOCK NOT FOUND\n"; $fail++; next; }
  my ($title, $b) = ($chapters[$id-1]->[1], $chapters[$id-1]->[4]);

  # --- split into the standard part + lanes (in whatever order they appear) -
  my @lanes = ();              # [name, part]
  while ($b =~ /\n[ \t]{2,4}(elite|challenging): \{/g) {
    my $name = $1;
    my $open = index($b, $name . ": {", pos($b) - length($name) - 3);
    my $brace = index($b, "{", $open);
    my ($close) = find_closing_at($b, $brace);
    last if $close < 0;
    push @lanes, [$name, substr($b, $open, $close - $open + 1)];
  }
  my $stdPart = $b;
  for my $ln (@lanes) {
    my $open = index($stdPart, $ln->[0] . ": {");
    my $brace = index($stdPart, "{", $open);
    my ($close) = find_closing_at($stdPart, $brace);
    next if $close < 0;
    substr($stdPart, $open, $close - $open + 1) = "";
  }

  my ($stdOk, $stdDet) = lane_check($stdPart);
  my @laneR = ();
  my $laneFail = 0;
  for my $ln (@lanes) {
    my ($ok, $det) = lane_check($ln->[1]);
    push @laneR, $ln->[0] . "[" . $det . "]";
    $laneFail++ unless $ok;
  }

  # --- Forge Standard 5: every quiz entry explains --------------------------
  my @quizObjs = $b =~ /\{ q: .*?\}/gs;
  my $noExplain = 0; my $emptyExplain = 0; my $minLen = 999999;
  for my $qo (@quizObjs) {
    if ($qo !~ /explain: "((?:[^"\\]|\\.)*)"/s) { $noExplain++; next; }
    my $txt = $1;
    $txt =~ s/\\n/ /g; $txt =~ s/\\(.)/$1/g;
    my $len = length($txt);
    $minLen = $len if $len < $minLen;
    $emptyExplain++ if $len < 20;
  }
  my $explainOk = (!@quizObjs) ? "no-quiz"
    : (($noExplain || $emptyExplain) ? "BAD(missing:$noExplain empty:$emptyExplain)" : "OK(min:$minLen)");

  # --- Forge Standard 1: slide anatomy in every native array ----------------
  # Content slides must carry teaching substance. The Forge-era anatomy opens
  # with `lead`; the original (Nearpod-era) Standard lane teaches via
  # body/bullets/example instead. Substance = lead OR body OR (bullets AND
  # insight) — a slide with only a title is a fail. Pause/close slides need body.
  my $allNative = $stdPart;
  for my $ln (@lanes) { $allNative .= "\n" . $ln->[1]; }
  my $noLeadLegacy = 0; my $noSubstance = 0; my $badBody = 0; my $contentSlides = 0;
  my $ni = index($allNative, "native: [");
  while ($ni >= 0) {
    my ($close) = find_closing_at($allNative, $ni + 8);
    last if $close < 0;
    my $native = substr($allNative, $ni, $close - $ni + 1);
    while ($native =~ /\{(?:[^{}]|\{([^{}]*)\})*\}/gs) {
      my $obj = $&;
      next unless $obj =~ /eyebrow: "/s;
      if ($obj =~ /kind: "(\w+)"/) {
        # pause/close carry body; poll is a question slide carrying options
        my $k = $1;
        if ($k eq "poll") { $badBody++ unless $obj =~ /options: \[/s; }
        else { $badBody++ unless $obj =~ /body: \[/s; }
      } else {
        $contentSlides++;
        my $hasLead = ($obj =~ /lead: "((?:[^"\\]|\\.)*)"/s);
        my $hasBody = ($obj =~ /body: \[/s);
        my $hasBullets = ($obj =~ /bullets: \[/s);
        my $hasInsight = ($obj =~ /insight: "((?:[^"\\]|\\.)*)"/s);
        $noLeadLegacy++ if !$hasLead && ($hasBody || $hasBullets);
        $noSubstance++  unless $hasLead || $hasBody || ($hasBullets && $hasInsight);
      }
    }
    $ni = index($allNative, "native: [", $close);
  }
  my $anatOk = ($contentSlides == 0 && $badBody == 0) ? "no-native"
    : (($noSubstance || $badBody) ? "BAD(noSubstance:$noSubstance noBody:$badBody of $contentSlides content)" : "OK($contentSlides content slides" . ($noLeadLegacy ? ", $noLeadLegacy legacy pre-lead" : "") . ")");

  my $laneStr = @laneR ? " lanes:" . join(" ", @laneR) : " lanes:none";
  printf "ch%-2d %-24s span:%d-%d%s explain:%s anatomy:%s\n",
    $id, $title, $chapters[$id-1]->[2], $chapters[$id-1]->[3], $laneStr, $explainOk, $anatOk;
  $fail++ unless !$laneFail && $explainOk =~ /^OK/ && $anatOk =~ /^OK/ && $stdOk;
}
print $fail ? "\n$fail FAILURES\n" : "\nALL 13 CHAPTERS VERIFIED — FORGE STANDARD MET\n";

# ---------- helpers ---------------------------------------------------------
# find the matching close for the brace at $start (string-aware)
sub find_closing_at {
  my ($s, $start) = @_;
  my $depth = 0; my $in_str = 0;
  for (my $i = $start; $i < length($s); $i++) {
    my $c = substr($s, $i, 1);
    if ($in_str) {
      if ($c eq '\\') { $i++; next; }
      $in_str = 0 if $c eq '"';
      next;
    }
    if ($c eq '"') { $in_str = 1; next; }
    if ($c eq '{' || $c eq '[') { $depth++; next; }
    if ($c eq '}' || $c eq ']') { $depth--; return ($i, 1) if $depth == 0; }
  }
  return (-1, 0);
}

sub lane_check {
  my ($part) = @_;
  my $slides = 0; $part =~ /slides: (\d+)/; $slides = $1 || 0;
  my @qsList = ();
  while ($part =~ /quizSlides: \[([^\]]*)\]/g) { push @qsList, ($1 =~ /\d+/g); }
  my $qs = scalar(@qsList);
  my @q = $part =~ /\{ q: "/g;
  my $natSlots = 0;
  my @nullAt = ();
  my $native = "";
  my $ni = index($part, "native: [");
  if ($ni >= 0) {
    my ($close) = find_closing_at($part, $ni + 8);
    if ($close > 0) {
      $native = substr($part, $ni, $close - $ni + 1);
      my @objs = $native =~ /\{\s*\n\s*(?:kind: "(\w+)"|eyebrow:)/gs;
      my @nulls = $native =~ /\bnull\b/g;
      $natSlots = scalar(@objs) + scalar(@nulls);
      @nullAt = native_null_positions($native);
    }
  }
  my $sOk = ($slides == $natSlots) ? "OK" : "MISMATCH(declared:$slides native:$natSlots)";
  my $qOk = ($qs == 0 && !@q) ? "no-quiz"
    : (($qs == scalar(@q)) ? "OK" : "MISMATCH(declared:$qs entries:" . scalar(@q) . ")");
  # Forge Standard 4: quiz positions must land on null slots (the player
  # renders a quiz exactly where native[n-1] is null) — a quiz index inside a
  # real slide or past the native array is silently unreachable.
  my %nullAt = map { $_ => 1 } @nullAt;
  my @badPos = grep { !$nullAt{$_} } @qsList;
  my $qPosOk = (!@qsList) ? "no-quiz" : (scalar(@badPos) ? "BAD(quiz pos outside nulls: " . join(",", @badPos) . ")" : "OK");
  return ($sOk eq "OK" && $qOk eq "OK" && $qPosOk eq "OK",
          "slides:$sOk quiz:$qOk qpos:$qPosOk");
}

# entry-order walk of a native array — returns the 1-based positions of nulls
sub native_null_positions {
  my ($native) = @_;
  my $i = index($native, "[");
  my $len = length($native);
  my @nulls; my $pos = 0;
  while ($i < $len) {
    my $c = substr($native, $i, 1);
    if ($c =~ /\s|,/) { $i++; next; }
    if ($c eq "]") { last; }
    if (substr($native, $i, 4) eq "null") { $pos++; push @nulls, $pos; $i += 4; next; }
    if ($c eq "{") {
      my $depth = 0; my $in = 0; my $done = 0;
      for (my $j = $i; $j < $len; $j++) {
        my $d = substr($native, $j, 1);
        if ($in) { if ($d eq '\\') { $j++; next; } $in = 0 if $d eq '"'; next; }
        if ($d eq '"') { $in = 1; next; }
        if ($d eq "{") { $depth++; next; }
        if ($d eq "}") { $depth--; if ($depth == 0) { $pos++; $i = $j + 1; $done = 1; last; } }
      }
      next if $done;
    }
    $i++;
  }
  return @nulls;
}
