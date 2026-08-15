#!/usr/bin/perl
# md2html.pl — convert an RFX markdown doc into a branded, print-ready HTML page.
# Handles the subset of Markdown used across the three RFX master documents:
# headings, bold/italic/code, bullet + numbered lists, pipe tables, blockquotes,
# horizontal rules and paragraphs. Core modules only.
# Usage: perl md2html.pl <input.md> <output.html> "<Title>" "<Eyebrow>"
use strict; use warnings;

my ($in, $out, $title, $eyebrow) = @ARGV;
$title   ||= "Reality FX";
$eyebrow ||= "THE TRADING ACADEMY";

open my $fh, "<", $in or die "$in: $!";
local $/; my $md = <$fh>; close $fh;

my $body = convert($md);

my $css = <<'CSS';
:root { --gold: #d4af37; --gold-soft: #c9b37a; --ink: #f2ecdc; --mut: #9a937f; --line: rgba(212,175,55,.28); --bg: #0e0d0a; --panel: #16140d; --panel2: #1c1a12; }
@page { size: A4; margin: 13mm 12mm 16mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: Georgia, "Times New Roman", serif; font-size: 10.5pt; line-height: 1.55; }
/* No fixed page width: the printable area is defined by the @page margins,
   so every line and table cell flows inside the page instead of being
   clipped at a hard 800px edge. Nothing is ever cut off to save space. */
.page { max-width: none; padding: 0 0 42px; }
.masthead { border-bottom: 2px solid var(--gold); padding-bottom: 14px; margin-bottom: 26px; }
.masthead .crown { font-size: 26px; color: var(--gold); }
.masthead h1 { font-family: Georgia, serif; font-size: 24pt; margin: 6px 0 2px; color: var(--ink); letter-spacing: .2px; }
.masthead .sub { font-size: 8pt; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; font-family: Arial, Helvetica, sans-serif; }
.masthead .tagline { font-style: italic; font-size: 10pt; color: var(--gold-soft); margin-top: 6px; }
h1 { font-size: 17pt; color: var(--gold); border-bottom: 1px solid var(--line); padding-bottom: 6px; margin: 30px 0 12px; }
h2 { font-size: 14pt; color: var(--gold); margin: 24px 0 10px; }
h3 { font-size: 12pt; color: var(--ink); margin: 18px 0 8px; }
h4 { font-size: 10.5pt; color: var(--gold); margin: 14px 0 6px; }
p { margin: 8px 0; }
strong { color: #fff; }
em { color: inherit; }
code { font-family: Consolas, "Courier New", monospace; font-size: 9pt; background: #1c1a12; border: 1px solid rgba(212,175,55,.3); border-radius: 3px; padding: 0 3px; color: #e8d79a; }
pre { background: #12100a; border: 1px solid rgba(212,175,55,.3); border-radius: 6px; padding: 10px 12px; white-space: pre-wrap; overflow-wrap: anywhere; font-family: Consolas, monospace; font-size: 8.5pt; color: #e8d79a; }
ul, ol { margin: 8px 0; padding-left: 22px; }
li { margin: 4px 0; }
li > ul, li > ol { margin: 2px 0; }
table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 9.5pt; }
tr { page-break-inside: avoid; }
td, th { overflow-wrap: anywhere; }
th { background: var(--panel2); color: var(--gold); text-align: left; font-weight: bold; }
th, td { border: 1px solid var(--line); padding: 6px 9px; vertical-align: top; }
blockquote { margin: 12px 0; padding: 10px 16px; border-left: 3px solid var(--gold); background: var(--panel); font-style: italic; color: #cfc7ae; }
blockquote p { margin: 4px 0; }
hr { border: 0; border-top: 1px solid var(--line); margin: 22px 0; }
.footer { position: fixed; bottom: 0; left: 0; right: 0; border-top: 1px solid var(--line); background: var(--bg); font-size: 8pt; color: var(--mut); text-align: center; padding: 6px 0; font-family: Arial, Helvetica, sans-serif; letter-spacing: 1px; }
.footer .gold { color: var(--gold); }
CSS

open my $oh, ">", $out or die "$out: $!";
print $oh <<"HTML";
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>$title</title>
<style>$css</style></head>
<body>
<div class="page">
  <div class="masthead">
    <div class="crown">&#9819;</div>
    <h1>$title</h1>
    <div class="sub">$eyebrow</div>
    <div class="tagline">&ldquo;Every lesson is a trade. Every trade is a lesson.&rdquo;</div>
  </div>
  $body
  <div class="footer"><span class="gold">&#9819;</span> REALITY FX — THE TRADING ACADEMY &nbsp;·&nbsp; Every lesson is a trade. Every trade is a lesson.</div>
</div>
</body></html>
HTML
close $oh;
print "wrote $out\n";

# ---------------- converter ----------------
sub convert {
    my ($md) = @_;
    my @lines = split /\r?\n/, $md;
    my @out;
    my $i = 0;
    my $n = scalar @lines;
    while ($i < $n) {
        my $line = $lines[$i];
        if ($line =~ /^# (.*)/)      { push @out, "<h1>" . inline($1) . "</h1>"; $i++; next; }
        if ($line =~ /^## (.*)/)     { push @out, "<h2>" . inline($1) . "</h2>"; $i++; next; }
        if ($line =~ /^### (.*)/)    { push @out, "<h3>" . inline($1) . "</h3>"; $i++; next; }
        if ($line =~ /^#### (.*)/)   { push @out, "<h4>" . inline($1) . "</h4>"; $i++; next; }
        if ($line =~ /^\s*---+\s*$/) { push @out, "<hr>"; $i++; next; }
        if ($line =~ /^```/) {
            my $code = "";
            $i++;
            while ($i < $n && $lines[$i] !~ /^```/) { $code .= $lines[$i] . "\n"; $i++; }
            $i++;
            push @out, "<pre>" . esc($code) . "</pre>";
            next;
        }
        if ($line =~ /^>\s?(.*)/) {
            my @q = ($1);
            $i++;
            while ($i < $n && $lines[$i] =~ /^>\s?(.*)/) { push @q, $1; $i++; }
            push @out, "<blockquote>" . (join "", map { "<p>" . inline($_) . "</p>" } @q) . "</blockquote>";
            next;
        }
        if ($line =~ /^\s*[-*]\s+(.*)/) {
            my @items = ($1);
            $i++;
            while ($i < $n && $lines[$i] =~ /^\s*[-*]\s+(.*)/) { push @items, $1; $i++; }
            while ($i < $n && $lines[$i] =~ /^\s+[-*]\s+(.*)/) { push @items, $1; $i++; }
            push @out, "<ul>" . (join "", map { "<li>" . inline($_) . "</li>" } @items) . "</ul>";
            next;
        }
        if ($line =~ /^\s*\d+[.)]\s+(.*)/) {
            my @items = ($1);
            $i++;
            while ($i < $n && $lines[$i] =~ /^\s*\d+[.)]\s+(.*)/) { push @items, $1; $i++; }
            push @out, "<ol>" . (join "", map { "<li>" . inline($_) . "</li>" } @items) . "</ol>";
            next;
        }
        # pipe table: header row + separator row
        if ($line =~ /^\s*\|/ && $i + 1 < $n && $lines[$i + 1] =~ /^\s*\|[\s:|,-]+\|/) {
            my @rows;
            while ($i < $n && $lines[$i] =~ /^\s*\|/) {
                my $r = $lines[$i];
                $r =~ s/^\s*\|//; $r =~ s/\|\s*$//;
                push @rows, [ split /\|/, $r ];
                $i++;
            }
            my $html = "<table>";
            for my $ri (0 .. $#rows) {
                next if $ri == 1 && join("", @{$rows[$ri]}) =~ /^[\s:|-]+$/;
                my $tag = $ri == 0 ? "th" : "td";
                $html .= "<tr>";
                for my $cell (@{ $rows[$ri] }) {
                    $cell =~ s/^\s+|\s+$//g;
                    $html .= "<$tag>" . inline($cell) . "</$tag>";
                }
                $html .= "</tr>";
            }
            $html .= "</table>";
            push @out, $html;
            next;
        }
        if ($line =~ /^\s*$/) { $i++; next; }
        # paragraph (consume until blank or a block start)
        my @para = ($line);
        $i++;
        while ($i < $n && $lines[$i] =~ /\S/ && $lines[$i] !~ /^(#|>|```|\s*[-*]\s|\s*\d+[.)]\s|\s*\|)/) {
            push @para, $lines[$i];
            $i++;
        }
        push @out, "<p>" . inline(join(" ", @para)) . "</p>";
    }
    return join "\n", @out;
}

sub esc {
    my ($s) = @_;
    $s =~ s/&/&amp;/g; $s =~ s/</&lt;/g; $s =~ s/>/&gt;/g;
    return $s;
}

sub inline {
    my ($s) = @_;
    $s = esc($s);
    $s =~ s/`([^`]*)`/&lt;code&gt;$1&lt;\/code&gt;/g;            # placeholder
    $s =~ s/&lt;code&gt;(.*?)&lt;\/code&gt;/code_span($1)/ge;   # real code tag
    $s =~ s/\*\*([^*]+)\*\*/<strong>$1<\/strong>/g;
    $s =~ s/(?<!\*)\*([^*\n]+)\*(?!\*)/<em>$1<\/em>/g;
    return $s;
}
sub code_span {
    my ($c) = @_;
    $c =~ s/&lt;/</g; $c =~ s/&gt;/>/g; $c =~ s/&amp;/&/g;
    return "<code>" . $c . "</code>";
}
