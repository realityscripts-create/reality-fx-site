#!/usr/bin/perl
# Reality FX System A — fork server (shared-store version).
# Serves the System A folder AND exposes GET/POST /api/state backed by a
# single JSON file, so registration links work from any browser on the
# machine (localhost only — production is Lee's Firebase). CORS headers are
# added so the WEBSITE origin (another port) can read/write the shared store
# through the demo enroll rail (see FOR-LEE 9.15 — production replaces the
# whole rail with a server-side webhook + POST /api/enroll).
#
# Usage: perl system-a-fork-server.pl <root-dir> <port> [state-file]
#   root-dir   : the System A folder to serve
#   port       : listen port (e.g. 8124)
#   state-file : where the shared JSON state lives (default: <script-dir>/system-a-state.json)
use strict;
use warnings;
use IO::Socket::INET;
use Fcntl ':flock';
use File::Copy;
use JSON::PP;
use Time::Local;

my $root = shift @ARGV || ".";
my $port = shift @ARGV || 8124;
my $stateFile = shift @ARGV;
$root =~ s/\\/\//g;
$root =~ s{/+$}{};
if (!$stateFile) {
  (my $dir = $0) =~ s{[\\/][^\\/]*$}{};
  $stateFile = "$dir/system-a-state.json";
}

my %mime = (
  html=>'text/html; charset=utf-8', htm=>'text/html; charset=utf-8',
  css=>'text/css; charset=utf-8', js=>'application/javascript; charset=utf-8',
  json=>'application/json', png=>'image/png', jpg=>'image/jpeg', jpeg=>'image/jpeg',
  gif=>'image/gif', svg=>'image/svg+xml', webp=>'image/webp', ico=>'image/x-icon',
  pdf=>'application/pdf', txt=>'text/plain; charset=utf-8', md=>'text/plain; charset=utf-8',
  woff2=>'font/woff2', woff=>'font/woff', ttf=>'font/ttf', otf=>'font/otf',
  mp4=>'video/mp4', webm=>'video/webm', mp3=>'audio/mpeg', wasm=>'application/wasm',
);

sub latest_snapshot {
  my @snaps = sort { $b cmp $a } glob("$stateFile.*.bak");
  return $snaps[0] || undef;
}
sub snapshot_store {
  # Rolling insurance: before any overwrite, the current good copy is parked
  # as a timestamped backup (keep the newest 10). The "verify, don't regex"
  # lesson from the wiped-store scare is now a server behaviour, not a habit.
  return 1 unless -f $stateFile;
  my $now = time();
  my $snap = "$stateFile.$now.bak";
  return 1 if -f $snap;
  copy($stateFile, $snap) or return 0;
  my @snaps = sort { $b cmp $a } glob("$stateFile.*.bak");
  for my $old (@snaps[10 .. $#snaps]) { unlink $old; }
  return 1;
}
sub load_state {
  return undef unless -f $stateFile;
  open my $fh, '<:raw', $stateFile or return undef;
  my $raw = do { local $/; <$fh> };
  close $fh;
  my $p = eval { JSON::PP->new->utf8->decode($raw) };
  return ($p && ref($p) eq 'HASH' && keys(%$p)) ? $p : undef if $p;
  # Corrupt store — the machine never serves garbage. Recover from the newest
  # snapshot and heal the live file so the next read is clean.
  my $snap = latest_snapshot();
  return undef unless $snap;
  open my $sf, '<:raw', $snap or return undef;
  my $sraw = do { local $/; <$sf> };
  close $sf;
  my $sp = eval { JSON::PP->new->utf8->decode($sraw) };
  return undef unless $sp && ref($sp) eq 'HASH' && keys(%$sp);
  rename($snap, $stateFile);  # heal in place
  print STDERR "[store-guard] state was corrupt — recovered from $snap\n";
  return $sp;
}
sub save_state_raw {
  my ($body) = @_;
  # Atomic write: the browser already serialized the state with the native
  # (fast) JSON.stringify — we write those bytes as-is, never JSON::PP
  # round-trip them (pure-Perl encode of a multi-MB store is far too slow).
  snapshot_store();
  my $tmp = "$stateFile.tmp";
  open my $fh, '>:raw', $tmp or return 0;
  flock($fh, LOCK_EX);
  print $fh $body;
  close $fh;
  return rename($tmp, $stateFile) ? 1 : 0;
}

sub gate_lookup_email {
  # Extract exactly one throttle record from the raw store bytes — never a
  # full decode. Finds the "loginAttempts" object by brace matching (its
  # values are flat { count, lockedUntil } — no nested braces), then decodes
  # only that slice. Keys are case-insensitive (the member panel lowercases
  # emails at the door).
  my ($email) = @_;
  return {} unless -f $stateFile;
  open my $fh, '<:raw', $stateFile or return {};
  my $raw = do { local $/; <$fh> };
  close $fh;
  my $idx = index($raw, '"loginAttempts"');
  return {} if $idx < 0;
  # the key must be followed by optional whitespace then ':' — never mid-string
  my $after = $idx + length('"loginAttempts"');
  $after++ while $after < length($raw) && substr($raw, $after, 1) =~ /\s/;
  return {} if $after >= length($raw) || substr($raw, $after, 1) ne ':';
  my $open = index($raw, '{', $after);
  return {} if $open < 0;
  my $depth = 0; my $end = -1;
  for (my $i = $open; $i < length($raw); $i++) {
    my $ch = substr($raw, $i, 1);
    if ($ch eq '{') { $depth++; }
    elsif ($ch eq '}') { $depth--; if ($depth == 0) { $end = $i; last; } }
  }
  return {} if $end < 0;
  my $obj = substr($raw, $open, $end - $open + 1);
  my $recs = eval { JSON::PP->new->utf8->decode($obj) };
  return {} unless $recs && ref($recs) eq 'HASH';
  return $recs->{lc($email)} || {};
}

sub cors_headers {
  return "Access-Control-Allow-Origin: *\r\n" .
         "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n" .
         "Access-Control-Allow-Headers: Content-Type\r\n";
}
sub resp_json {
  my ($c, $code, $obj) = @_;
  my $body = JSON::PP->new->utf8->encode($obj);
  print $c "HTTP/1.1 $code\r\nContent-Type: application/json\r\n" .
    cors_headers() .
    "Content-Length: " . length($body) . "\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n$body";
}
sub resp_raw {
  my ($c, $code, $body) = @_;
  print $c "HTTP/1.1 $code\r\nContent-Type: application/json\r\n" .
    cors_headers() .
    "Content-Length: " . length($body) . "\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n$body";
}
sub read_body {
  my ($c, $clen) = @_;
  $clen = 0 unless defined $clen && $clen =~ /^\d+$/;
  $clen = 10485760 if $clen > 10485760; # cap at 10 MB (selfies live in state)
  my $body = '';
  # Plain blocking read (reliable on MSYS2 perl), bounded by alarm so a
  # stalled client can never hold a forked child forever. The child can die
  # safely — the parent keeps serving.
  eval {
    local $SIG{ALRM} = sub { die "read timeout\n" };
    alarm 15;
    while (length($body) < $clen) {
      my $chunk = read($c, my $buf, $clen - length($body));
      die "connection closed\n" unless defined $chunk && $chunk > 0;
      $body .= $buf;
    }
    alarm 0;
  };
  alarm 0;
  return $body;
}

my $server = IO::Socket::INET->new(
  LocalAddr => '127.0.0.1', LocalPort => $port, ReuseAddr => 1,
  Listen => 32, Proto => 'tcp'
) or die "bind $port failed: $!\n";

print STDERR "serving $root on 127.0.0.1:$port  (state -> $stateFile)\n";
$SIG{CHLD} = 'IGNORE';

while (my $client = $server->accept()) {
  my $pid = fork();
  if (defined $pid && $pid == 0) { serve($client); exit 0; }
  close $client;
}

sub serve {
  my ($c) = @_;
  my $req = <$c>;
  if (!defined $req) { close $c; return; }
  my ($method, $path) = $req =~ m{^(\S+)\s+(\S+)\s+HTTP/};
  close $c and return unless $method;
  my $clen = 0;
  while (my $l = <$c>) {
    if ($l =~ /^Content-Length:\s*(\d+)/i) { $clen = $1; }
    last if $l =~ /^\r?\n$/;
  }

  my $clean = $path; $clean =~ s/\?.*$//;

  if ($method eq 'OPTIONS' && $clean eq '/api/gate') {
    resp_json($c, 204, {});
    close $c; return;
  }

  if ($method eq 'GET' && $clean eq '/api/gate') {
    # The gate (FOR-LEE §9.61-9.63): a live read of System A's own throttle
    # record. Unlocked / unknown / expired -> { locked:false } — the OS
    # heartbeat shows "Open" and sessions flow. Locked -> the OS refuses the
    # session and shows the branded lock card with the countdown.
    # NOTE: never load_state() here — a full JSON::PP decode of the multi-MB
    # store can take minutes (the /api/state route exists for that reason).
    # Scan for the one loginAttempts record instead: brace-matched, fast.
    my ($email) = $path =~ /[?&]email=([^&]+)/;
    $email = '' unless defined $email;
    $email =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;
    my $rec = gate_lookup_email($email) || {};
    my $until = $rec->{lockedUntil} || '';
    my $untilEpoch = 0;
    if ($until =~ /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/) {
      $untilEpoch = timegm($6, $5, $4, $3, $2 - 1, $1 - 1900);
    }
    if ($untilEpoch > time()) {
      my $mins = int(($untilEpoch - time()) / 60) + 1;
      resp_json($c, 200, { locked => JSON::PP::true, lockedUntil => $until, minutesLeft => $mins });
    } else {
      resp_json($c, 200, { locked => JSON::PP::false });
    }
    close $c; return;
  }

  if ($method eq 'OPTIONS' && $clean eq '/api/state') {
    resp_json($c, 204, {});
    close $c; return;
  }

  if ($method eq 'GET' && $clean eq '/api/state') {
    # Serve the raw bytes — the browser parses them with native JSON.parse.
    # NEVER JSON::PP round-trip the store here: pure-Perl decode/encode of a
    # multi-MB state (selfies, email HTML) can take minutes and freeze every
    # page that waits on this endpoint (the "Page Unresponsive" hang).
    if (-f $stateFile) {
      open my $fh, '<:raw', $stateFile or do { resp_json($c, 500, { error => 'read error' }); close $c; return; };
      my $raw = do { local $/; <$fh> };
      close $fh;
      # Cheap corruption check (never a full JSON::PP round-trip here — that
      # freezes multi-MB pages). If the file lost its JSON shape, heal from the
      # newest snapshot so the machine never serves garbage.
      my $t = $raw; $t =~ s/^\s+//; $t =~ s/\s+$//;
      if (substr($t, 0, 1) ne '{' || substr($t, -1, 1) ne '}' || $raw eq '') {
        my $snap = latest_snapshot();
        if ($snap) {
          print STDERR "[store-guard] GET found corrupt state — healing from $snap\n";
          rename($snap, $stateFile);
          open my $sf, '<:raw', $stateFile or do { resp_json($c, 500, { error => 'read error' }); close $c; return; };
          $raw = do { local $/; <$sf> };
          close $sf;
        }
      }
      resp_raw($c, 200, $raw eq '' ? '{}' : $raw);
    } else {
      resp_json($c, 200, {});
    }
    close $c; return;
  }

  if ($method eq 'POST' && $clean eq '/api/state') {
    my $body = read_body($c, $clen);
    # Hard size guard — the client auto-prunes (outbox cap, stale scratch
    # records) so the store stays lean, but the server refuses to grow
    # without bound no matter what a client sends. 6MB is far beyond any
    # legit demo store (selfies live in the browser until production).
    if (length($body) > 6291456) {
      resp_json($c, 413, { ok => JSON::PP::false, reason => 'state too large — prune the demo store (see db.js pruneState)' });
      close $c; return;
    }
    # Cheap shape check only — a full JSON::PP decode of a multi-MB store is
    # far too slow for pure Perl. The client serialized with native
    # JSON.stringify; we validate the braces and write atomically.
    my $trimmed = $body;
    $trimmed =~ s/^\s+//;
    $trimmed =~ s/\s+$//;
    if (substr($trimmed, 0, 1) ne '{' || substr($trimmed, -1, 1) ne '}') {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'invalid JSON object' });
      close $c; return;
    }
    save_state_raw($body);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }

  # static files
  my $rel = $path;
  $rel =~ s/\?.*$//;
  $rel =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;
  $rel = '/index.html' if $rel eq '/' || $rel eq '';
  my $abs = "$root$rel";
  if ($abs !~ m{^\Q$root\E(/|$)}) { resp_json($c, 403, { error => 'forbidden' }); close $c; return; }
  $abs = "$abs/index.html" if -d $abs;

  if (-f $abs) {
    open my $fh, '<:raw', $abs or do { resp_json($c, 500, { error => 'read error' }); close $c; return; };
    my $size = -s $abs;
    my ($ext) = $abs =~ /\.([A-Za-z0-9]+)$/;
    my $ct = $mime{lc($ext||'')} || 'application/octet-stream';
    print $c "HTTP/1.1 200 OK\r\nContent-Type: $ct\r\nContent-Length: $size\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n";
    my $buf;
    while (read($fh, $buf, 65536)) { print $c $buf; }
    close $fh;
    close $c; return;
  }

  resp_json($c, 404, { error => 'not found' });
  close $c;
}
