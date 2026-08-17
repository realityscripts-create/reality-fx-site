#!/usr/bin/perl
# Reality FX OS — local server with the handoff endpoint.
# System A's bridge POSTs the approved student identity to /os/api/handoff;
# this server stores it idempotently by studentId and the OS frontend reads
# it back via GET /os/api/handoffs to greet the verified student.
#
# Usage: perl os-handoff-server.pl <root-dir> <port> [state-file]
#   root-dir   : the folder to serve (the parent of the os/ folder)
#   port       : listen port
#   state-file : where handed-off identities are stored (default: <script-dir>/../os-handoffs.json)
use strict;
use warnings;
use IO::Socket::INET;
use Fcntl ':flock';
use File::Copy;
use JSON::PP;

my $root = shift @ARGV || ".";
my $port = shift @ARGV || 49270;
my $stateFile = shift @ARGV;
$root =~ s/\\/\//g;
$root =~ s{/+$}{};
if (!$stateFile) {
  (my $dir = $0) =~ s{[\\/][^\\/]*$}{};
  $stateFile = "$dir/os-handoffs.json";
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

sub load_handoffs {
  return [] unless -f $stateFile;
  open my $fh, '<:raw', $stateFile or return [];
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || [];
}

# --- store guard: every OS-side JSON file writes atomically (tmp + rename)
# so a crash mid-write can never leave a half-written store, and the previous
# good copy is parked as a timestamped backup before any overwrite. The same
# lesson that hardened the System A store applies here: the machine never
# serves garbage and can always undo.
sub atomic_write {
  my ($file, $content) = @_;
  return 1 unless defined $content;
  if (-f $file) { copy($file, "$file." . time() . ".bak"); }
  my $tmp = "$file.tmp";
  open my $fh, '>:raw', $tmp or return 0;
  flock($fh, LOCK_EX);
  print $fh $content;
  close $fh;
  my $ok = rename($tmp, $file) ? 1 : 0;
  # keep only the newest 6 backups of this file
  my @snaps = sort { $b cmp $a } glob("$file.*.bak");
  for my $old (@snaps[6 .. $#snaps]) { unlink $old; }
  return $ok;
}

sub save_handoffs {
  my ($list) = @_;
  return atomic_write($stateFile, JSON::PP->new->utf8->canonical->pretty->encode($list));
}

# --- session store (single active session per student, per device) ---
# One row per (studentId, deviceId, token): the same device may hold several
# tabs (each its own token); a DIFFERENT device claiming the same studentId
# revokes every row of the old device — that is the single-session guard.
sub sessions_file { my $s = $stateFile; $s =~ s/handoffs\.json$/sessions.json/; return $s; }
sub load_sessions {
  my $f = sessions_file();
  return [] unless -f $f;
  open my $fh, '<:raw', $f or return [];
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || [];
}
sub save_sessions {
  my ($list) = @_;
  return atomic_write(sessions_file(), JSON::PP->new->utf8->canonical->pretty->encode($list));
}

sub flags_file { my $s = $stateFile; $s =~ s/handoffs\.json$/flags.json/; return $s; }
sub load_flags {
  my $f = flags_file();
  return [] unless -f $f;
  open my $fh, '<:raw', $f or return [];
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || [];
}
sub save_flags {
  my ($list) = @_;
  return atomic_write(flags_file(), JSON::PP->new->utf8->canonical->pretty->encode($list));
}

# --- device trust store (per-student known devices + open challenges) ---
sub device_store_file { my $s = $stateFile; $s =~ s/handoffs\.json$/devices.json/; return $s; }
sub load_device_records {
  my $f = device_store_file();
  return {} unless -f $f;
  open my $fh, '<:raw', $f or return {};
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || {};
}
sub save_device_records {
  my ($rec) = @_;
  return atomic_write(device_store_file(), JSON::PP->new->utf8->canonical->pretty->encode($rec));
}
sub load_devices   { my $r = load_device_records(); return $r->{$_[0]}{devices}    || []; }
sub load_challenges{ my $r = load_device_records(); return $r->{$_[0]}{challenges} || []; }
sub save_devices {
  my ($sid, $devs) = @_;
  my $r = load_device_records();
  $r->{$sid} ||= {};
  $r->{$sid}{devices} = $devs;
  return save_device_records($r);
}
sub save_challenges {
  my ($sid, $list) = @_;
  my $r = load_device_records();
  $r->{$sid} ||= {};
  $r->{$sid}{challenges} = $list;
  return save_device_records($r);
}

# --- audit result cache (the last completed regression walk) ---
sub audit_cache_file { my $s = $stateFile; $s =~ s/handoffs\.json$/audit-cache.json/; return $s; }

# --- Trading Challenge leaderboard (machine-signed results) ---
sub challenges_file { my $s = $stateFile; $s =~ s/handoffs\.json$/challenges.json/; return $s; }
sub load_board {
  my $f = challenges_file();
  return {} unless -f $f;
  open my $fh, '<:raw', $f or return {};
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || {};
}
sub save_board {
  my ($d) = @_;
  return atomic_write(challenges_file(), JSON::PP->new->utf8->canonical->pretty->encode($d));
}

# --- PII incident rail: every blocked sensitive-data attempt, logged ---
# Server-side blocks (bypassed clients) and client-side block reports land in
# the same store; the Staff Console reads it as the incident board.
sub pii_file { my $s = $stateFile; $s =~ s/handoffs\.json$/pii-incidents.json/; return $s; }
sub load_pii {
  my $f = pii_file();
  return [] unless -f $f;
  open my $fh, '<:raw', $f or return [];
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || [];
}
sub save_pii {
  my ($d) = @_;
  return atomic_write(pii_file(), JSON::PP->new->utf8->canonical->pretty->encode($d));
}
sub log_pii_incident {
  my ($pl) = @_;
  my $inc = {
    at => time(),
    room => substr($pl->{room} || '', 0, 40),
    name => substr($pl->{name} || 'Unknown', 0, 60),
    role => substr($pl->{role} || 'student', 0, 20),
    reason => substr($pl->{reason} || 'sensitive information', 0, 60),
    sample => substr($pl->{sample} || '', 0, 80),
  };
  my $list = load_pii();
  unshift @$list, $inc;
  if (@$list > 200) { @$list = splice(@$list, 0, 200); }
  save_pii($list);
  return $inc;
}

# --- Data-request rail: the student's "my data / delete me" rights, exercised ---
# A student requests a copy or a deletion from the OS profile room; the request
# lands here with a reference number and the Staff Console reads it as a board.
sub data_requests_file { my $s = $stateFile; $s =~ s/handoffs\.json$/data-requests.json/; return $s; }
sub load_data_requests {
  my $f = data_requests_file();
  return [] unless -f $f;
  open my $fh, '<:raw', $f or return [];
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || [];
}
sub save_data_requests {
  my ($d) = @_;
  return atomic_write(data_requests_file(), JSON::PP->new->utf8->canonical->pretty->encode($d));
}
sub log_data_request {
  my ($pl) = @_;
  my $kind = ($pl->{kind} eq 'delete') ? 'delete' : 'export';
  my $req = {
    ref => 'DR-' . sprintf('%04d', int(rand(9000)) + 1000) . '-' . substr(time(), -4),
    kind => $kind,
    at => time(),
    name => substr($pl->{name} || 'Unknown', 0, 60),
    email => substr($pl->{email} || '', 0, 80),
    studentId => substr($pl->{studentId} || '', 0, 40),
    note => substr($pl->{note} || '', 0, 160),
    status => 'received',
  };
  my $list = load_data_requests();
  unshift @$list, $req;
  if (@$list > 500) { @$list = splice(@$list, 0, 500); }
  save_data_requests($list);
  return $req;
}

# --- Credential registry (the /verify rail) ---
# The public verification page reads this store (GET /os/api/credentials) and
# logs every lookup outcome (POST /os/api/credentials/activity) so verification
# activity is auditable without ever storing the scanner's identity. The
# registry itself is seeded with the desk sample + a demo REVOKED record; real
# credentials are minted via the Phase 2 admin console once the Academy opens.
sub credentials_file { my $s = $stateFile; $s =~ s/handoffs\.json$/credentials.json/; return $s; }
sub load_credentials {
  my $f = credentials_file();
  return [] unless -f $f;
  open my $fh, '<:raw', $f or return [];
  my $raw = do { local $/; <$fh> };
  close $fh;
  my $j = eval { JSON::PP->new->utf8->decode($raw) };
  return ($j && ref($j) eq 'HASH' && ref($j->{credentials}) eq 'ARRAY') ? $j->{credentials} : [];
}
sub cred_activity_file { my $s = $stateFile; $s =~ s/handoffs\.json$/cred-activity.json/; return $s; }
sub load_cred_activity {
  my $f = cred_activity_file();
  return [] unless -f $f;
  open my $fh, '<:raw', $f or return [];
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || [];
}
sub save_cred_activity {
  my ($list) = @_;
  return atomic_write(cred_activity_file(), JSON::PP->new->utf8->canonical->pretty->encode($list));
}
sub log_cred_activity {
  my ($pl) = @_;
  my $rec = {
    id      => substr($pl->{id} || '', 0, 40),
    outcome => substr($pl->{outcome} || 'LOOKUP', 0, 16),
    at      => time(),
  };
  my $list = load_cred_activity();
  push @$list, $rec;
  if (@$list > 2000) { @$list = splice(@$list, -2000); }
  save_cred_activity($list);
  return $rec;
}
# Save the full registry (used by mint / revoke / register). The file is the
# single source of truth; every write is atomic like every other OS store.
sub save_credentials {
  my ($list) = @_;
  return atomic_write(credentials_file(), JSON::PP->new->utf8->canonical->pretty->encode({ credentials => $list }));
}
# A registry write is only for verified identities: the caller must be an
# enrolled student (auto-register on issue) or the registry admin (mint,
# revoke — the founder or a handoff with role=admin). The role is read from
# the server's OWN handoff store, never from the client's claim alone.
sub registry_auth {
  my ($sid) = @_;
  return 'none' unless $sid;
  my $rec;
  for my $h (@{ load_handoffs() }) { if ($h->{studentId} eq $sid) { $rec = $h; last; } }
  return 'none' unless $rec;
  return 'admin' if $rec->{founder} || ($rec->{role} || '') eq 'admin';
  return 'student';
}
sub cred_id_ok {
  my ($id) = @_;
  return ($id =~ /^RFX-\d{4}-[0-9A-Z]{4,8}$/) ? 1 : 0;
}
sub registry_find {
  my ($list, $id) = @_;
  for my $r (@$list) { return $r if ($r->{credential_id} || '') eq $id; }
  return undef;
}
sub registry_put {
  my ($list, $rec) = @_;
  for my $r (@$list) { return $r if ($r->{credential_id} || '') eq $rec->{credential_id}; }
  push @$list, $rec;
  return undef;
}

# --- Live Rooms store (Live Studio broadcasts: mentor lessons + staff meetings) ---
sub rooms_file { my $s = $stateFile; $s =~ s/handoffs\.json$/rooms.json/; return $s; }
sub load_rooms {
  my $f = rooms_file();
  return [] unless -f $f;
  open my $fh, '<:raw', $f or return [];
  my $raw = do { local $/; <$fh> };
  close $fh;
  return eval { JSON::PP->new->utf8->decode($raw) } || [];
}
sub save_rooms {
  my ($list) = @_;
  return atomic_write(rooms_file(), JSON::PP->new->utf8->canonical->pretty->encode($list));
}
sub gen_room_code {
  my @c = ('A'..'H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','2'..'9'); # no 0/1/I/O
  my $code = '';
  for (1..5) { $code .= $c[int(rand(@c))]; }
  return $code;
}

# PII scanner — the chat guard's server half. Mirrors the client's hard-block
# list so a bypassed client still can't post card numbers, bank/IBAN details,
# national IDs, SSNs, passport & licence numbers, crypto wallets, passwords
# or live 2FA codes into a room chat.
sub dlp_hit {
  my ($t) = @_;
  my @rules = (
    [ qr/\b(?:\d[ -]?){13,19}\b/, 'a card or long account number' ],
    [ qr/\b\d{13}\b/, 'a national ID number' ],
    [ qr/\b\d{3}-\d{2}-\d{4}\b/, 'a Social Security number' ],
    [ qr/\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/, 'an IBAN / international bank account' ],
    [ qr/\b(?:bank|account|acc)\b\s*(?:no\.?|number|#)?\s*(?:is|:|=|#)?\s*\d{6,17}\b/i, 'a bank account number' ],
    [ qr/\b(?:routing|aba|sort)\s*code\s*(?:is|:|=|#)?\s*\d{6,9}\b/i, 'a routing or sort code' ],
    [ qr/\b(?:passport|travel\s*doc)\b\s*(?:is|:|=|#)?\s*[A-Z]{1,2}\d{6,9}\b/i, 'a passport number' ],
    [ qr/\b(?:driver'?s|driving)\s*licen[cs]e\s*(?:is|:|=|#)?\s*[A-Z0-9-]{6,16}\b/i, 'a driving licence number' ],
    [ qr/\b(?:bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/, 'a crypto wallet address' ],
    [ qr/0x[a-fA-F0-9]{40}\b/, 'a crypto wallet address' ],
    [ qr/\b(?:password|passwd|pwd|pin|secret)\b\s*(?:[:=]|\bis\s+)\S+/i, 'a password or PIN' ],
    [ qr/\b(?:otp|2fa|two[- ]factor)\b\s*(?:code|pin)?\s*(?:is|:|=|#)?\s*\d{4,8}\b/i, 'a live login / 2FA code' ],
    [ qr/\b(?:login|verification|confirm(?:ation)?|one[- ]time)\s+code\s*(?:is|:|=|#)?\s*\d{4,8}\b/i, 'a live login / 2FA code' ],
  );
  for my $r (@rules) { return $r->[1] if $t =~ $r->[0]; }
  return '';
}

sub resp_json {
  my ($c, $code, $obj) = @_;
  my $body = JSON::PP->new->utf8->encode($obj);
  # CORS: System A's browser POSTs here from another port (127.0.0.1:8123),
  # so the endpoint must answer preflights and carry the allow-origin header.
  print $c "HTTP/1.1 $code\r\n" .
    "Content-Type: application/json\r\n" .
    "Access-Control-Allow-Origin: *\r\n" .
    "Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n" .
    "Access-Control-Allow-Headers: Content-Type\r\n" .
    "Content-Length: " . length($body) . "\r\n" .
    "Cache-Control: no-store\r\nConnection: close\r\n\r\n$body";
}

sub read_body {
  my ($c, $clen) = @_;
  $clen = 0 unless defined $clen && $clen =~ /^\d+$/;
  $clen = 262144 if $clen > 262144; # cap at 256 KB
  my $body = '';
  while (length($body) < $clen) {
    my $chunk = read($c, my $buf, $clen - length($body));
    last unless defined $chunk && $chunk > 0;
    $body .= $buf;
  }
  return $body;
}

my $server = IO::Socket::INET->new(
  LocalAddr => '127.0.0.1', LocalPort => $port, ReuseAddr => 1,
  Listen => 32, Proto => 'tcp'
) or die "bind $port failed: $!\n";

print STDERR "serving $root on 127.0.0.1:$port  (handoffs -> $stateFile)\n";
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

  # CORS preflight — the browser asks permission before the real POST
  if ($method eq 'OPTIONS' && $clean eq '/os/api/handoff') {
    resp_json($c, 204, {});
    close $c; return;
  }

  if ($method eq 'POST' && $clean eq '/os/api/handoff') {
    my $body = read_body($c, $clen);
    my $payload = eval { JSON::PP->new->utf8->decode($body) };
    if (!$payload || ref($payload) ne 'HASH' || !$payload->{studentId}) {
      resp_json($c, 400, { received => JSON::PP::false, reason => 'missing studentId' });
      close $c; return;
    }
    my $list = load_handoffs();
    my $existing = 0;
    for my $h (@$list) { $existing = 1 if $h->{studentId} eq $payload->{studentId}; }
    if (!$existing) {
      my $rec = {
        studentId   => $payload->{studentId},
        studentCode => $payload->{studentCode} || '',
        verifiedName=> $payload->{verifiedName} || $payload->{name} || '',
        email       => $payload->{email} || '',
        course      => $payload->{course} || '',
        entitlements=> $payload->{entitlements} || {},
        printTrust  => $payload->{printTrust} || 'standard',
        status      => $payload->{status} || 'ready',
        # FOR-LEE §9.38/§9.39 contract fields — optional, defaults keep the
        # record backward-compatible. The OS reads these back.
        role          => substr($payload->{role} || '', 0, 20),
        founder       => ($payload->{founder} ? JSON::PP::true : JSON::PP::false),
        demoTourEndsAt=> $payload->{demoTourEndsAt} || '',
        trust         => ($payload->{trust} && ref($payload->{trust}) eq 'HASH') ? $payload->{trust} : {},
        receivedAt  => scalar(gmtime),
      };
      push @$list, $rec;
      save_handoffs($list);
    }
    resp_json($c, 200, { received => JSON::PP::true, already => ($existing ? JSON::PP::true : JSON::PP::false) });
    close $c; return;
  }

  if ($method eq 'GET' && $clean eq '/os/api/handoffs') {
    resp_json($c, 200, load_handoffs());
    close $c; return;
  }

  # --- Live Rooms rail: the Live Studio (hosts) + Live Rooms (students) ---
  # Demo store is this JSON file, so every browser on the machine joins the
  # same room (like the registration links). Production: Firestore rooms
  # collection with realtime listeners — see FOR-LEE.md.
  if ($method eq 'OPTIONS' && $clean =~ m{^/os/api/rooms(?:/|\z)}) {
    resp_json($c, 204, {});
    close $c; return;
  }
  if ($method eq 'OPTIONS' && $clean =~ m{^/os/api/pii-incidents(?:/|\z)}) {
    resp_json($c, 204, {});
    close $c; return;
  }
  if ($method eq 'GET' && $clean eq '/os/api/pii-incidents') {
    resp_json($c, 200, { incidents => load_pii() });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/pii-incidents') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if ($pl && $pl->{action} eq 'clear') {
      save_pii([]);
      resp_json($c, 200, { ok => JSON::PP::true });
      close $c; return;
    }
    # client-side block report (fire-and-forget) — same board, one store
    if ($pl && $pl->{reason}) {
      log_pii_incident($pl);
      resp_json($c, 200, { ok => JSON::PP::true });
      close $c; return;
    }
    resp_json($c, 400, { ok => JSON::PP::false, reason => 'reason or action required' });
    close $c; return;
  }
  if ($method eq 'OPTIONS' && $clean =~ m{^/os/api/data-requests(?:/|\z)}) {
    resp_json($c, 204, {});
    close $c; return;
  }
  if ($method eq 'GET' && $clean eq '/os/api/data-requests') {
    resp_json($c, 200, { requests => load_data_requests() });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/data-requests') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{name} || !($pl->{kind} eq 'export' || $pl->{kind} eq 'delete')) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'name and kind (export|delete) required' });
      close $c; return;
    }
    my $req = log_data_request($pl);
    # The receipt email rides the production rail (osapi.js sends it via
    # Resend when the key is configured). On the local dev server the mail
    # rail is not configured, so the receipt stays 'pending' — the board and
    # the reference number are the receipt, exactly like the demo-code flow.
    resp_json($c, 200, { ok => JSON::PP::true, ref => $req->{ref}, kind => $req->{kind}, receiptEmail => 'pending' });
    close $c; return;
  }
  # --- Credential verification rail (the /verify page + Registry Console) ---
  # GET serves the registry (VALID / REVOKED records); POST logs a lookup
  # outcome for audit. No scanner identity is ever stored — only the
  # credential ID, the outcome, and the time. Writes (register / mint /
  # revoke) are gated on the server's OWN handoff store: an enrolled
  # student may auto-register their earned credential; only the founder or
  # an admin handoff may mint or revoke.
  if ($method eq 'OPTIONS' && $clean =~ m{^/os/api/credentials(?:/|\z)}) {
    resp_json($c, 204, {});
    close $c; return;
  }
  if ($method eq 'GET' && $clean eq '/os/api/credentials') {
    resp_json($c, 200, { credentials => load_credentials() });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/credentials/activity') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{id}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'id required' });
      close $c; return;
    }
    log_cred_activity($pl);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/credentials/register') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{credential_id} || !$pl->{student_name}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'credential_id and student_name required' });
      close $c; return;
    }
    # only a verified enrolled identity may register its own earned credential
    my $auth = registry_auth($pl->{student_id} || '');
    if ($auth eq 'none') {
      resp_json($c, 403, { ok => JSON::PP::false, reason => 'verified identity required' });
      close $c; return;
    }
    my $id = uc($pl->{credential_id});
    if (!cred_id_ok($id)) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'malformed credential id' });
      close $c; return;
    }
    my $list = load_credentials();
    if (registry_find($list, $id)) {
      resp_json($c, 200, { ok => JSON::PP::true, already => JSON::PP::true, credential_id => $id });
      close $c; return;
    }
    push @$list, {
      credential_id   => $id,
      credential_name => substr($pl->{credential_name} || 'RFX Certified Trader', 0, 80),
      student_name    => substr($pl->{student_name}, 0, 80),
      issue_date      => substr($pl->{issue_date} || '', 0, 60),
      status          => 'VALID',
      registered_by   => substr($pl->{student_id} || '', 0, 40),
      registered_at   => scalar(gmtime),
    };
    save_credentials($list);
    resp_json($c, 200, { ok => JSON::PP::true, already => JSON::PP::false, credential_id => $id });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/credentials/mint') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{credential_id} || !$pl->{student_name}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'credential_id and student_name required' });
      close $c; return;
    }
    if (registry_auth($pl->{admin_id} || '') ne 'admin') {
      resp_json($c, 403, { ok => JSON::PP::false, reason => 'registry admin required' });
      close $c; return;
    }
    my $id = uc($pl->{credential_id});
    if (!cred_id_ok($id)) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'malformed credential id' });
      close $c; return;
    }
    my $list = load_credentials();
    if (registry_find($list, $id)) {
      resp_json($c, 200, { ok => JSON::PP::true, already => JSON::PP::true, credential_id => $id });
      close $c; return;
    }
    push @$list, {
      credential_id   => $id,
      credential_name => substr($pl->{credential_name} || 'RFX Certified Trader', 0, 80),
      student_name    => substr($pl->{student_name}, 0, 80),
      issue_date      => substr($pl->{issue_date} || '', 0, 60),
      status          => 'VALID',
      minted_by       => substr($pl->{admin_id} || '', 0, 40),
      minted_at       => scalar(gmtime),
    };
    save_credentials($list);
    resp_json($c, 200, { ok => JSON::PP::true, already => JSON::PP::false, credential_id => $id });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/credentials/revoke') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{credential_id}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'credential_id required' });
      close $c; return;
    }
    if (registry_auth($pl->{admin_id} || '') ne 'admin') {
      resp_json($c, 403, { ok => JSON::PP::false, reason => 'registry admin required' });
      close $c; return;
    }
    my $id = uc($pl->{credential_id});
    my $list = load_credentials();
    my $rec = registry_find($list, $id);
    if (!$rec) {
      resp_json($c, 404, { ok => JSON::PP::false, reason => 'no such credential' });
      close $c; return;
    }
    if (($rec->{status} || '') eq 'REVOKED') {
      resp_json($c, 200, { ok => JSON::PP::true, already => JSON::PP::true, credential_id => $id });
      close $c; return;
    }
    $rec->{status} = 'REVOKED';
    $rec->{revoked_at} = scalar(gmtime);
    $rec->{revocation_reason} = substr($pl->{reason} || '', 0, 160);
    $rec->{revoked_by} = substr($pl->{admin_id} || '', 0, 40);
    save_credentials($list);
    resp_json($c, 200, { ok => JSON::PP::true, already => JSON::PP::false, credential_id => $id });
    close $c; return;
  }
  if ($method eq 'GET' && $clean eq '/os/api/credentials/activity') {
    my ($sid) = $path =~ /[?&]admin=([^&]+)/;
    if (registry_auth($sid || '') ne 'admin') {
      resp_json($c, 403, { ok => JSON::PP::false, reason => 'registry admin required' });
      close $c; return;
    }
    resp_json($c, 200, { activity => load_cred_activity() });
    close $c; return;
  }
  if ($method eq 'GET' && $clean eq '/os/api/rooms') {
    my $list = load_rooms();
    # The Study Hall — an always-open room, pinned for the community. Created
    # on first read if absent so it survives restarts and needs no host.
    my $hall;
    for my $r (@$list) { $hall = $r if $r->{code} eq 'HALL5'; }
    if (!$hall) {
      $hall = {
        code => 'HALL5', title => 'The Study Hall', kind => 'mentor', format => 'hall',
        provider => 'custom', lesson => '', startsAt => 0, capacity => 0,
        calendarShare => JSON::PP::false, host => 'The Academy', hostId => 'academy',
        broadcastUrl => '', note => 'Always open — drop in, study with whoever is here, keep each other sharp. No host, no schedule: the room is the campus.',
        status => 'live', scheduledAt => 0, liveAt => time(), endsAt => 0, chat => [], present => [], requests => [], bookings => [], waiting => [], createdAt => time(),
      };
      push @$list, $hall;
      save_rooms($list);
    }
    resp_json($c, 200, { rooms => $list });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || ref($pl) ne 'HASH' || !$pl->{hostId}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'hostId required' });
      close $c; return;
    }
    if (!$pl->{code} && !$pl->{title}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'title required for a new room' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    if ($pl->{code}) {
      for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
      if (!$room) { resp_json($c, 404, { ok => JSON::PP::false, reason => 'room not found' }); close $c; return; }
      if ($room->{hostId} ne $pl->{hostId}) { resp_json($c, 403, { ok => JSON::PP::false, reason => 'host only' }); close $c; return; }
      $room->{title} = $pl->{title} if defined $pl->{title};
      $room->{kind} = $pl->{kind} if defined $pl->{kind};
      $room->{broadcastUrl} = $pl->{broadcastUrl} if defined $pl->{broadcastUrl};
      $room->{note} = $pl->{note} if defined $pl->{note};
      if (defined $pl->{status} && $pl->{status} eq 'live' && !$room->{liveAt}) { $room->{liveAt} = time(); }
      if (defined $pl->{status} && $pl->{status} eq 'ended') { $room->{endsAt} = time(); }
      $room->{status} = $pl->{status} if defined $pl->{status};
    } else {
      $room = {
        code => gen_room_code(),
        title => $pl->{title},
        kind => $pl->{kind} || 'mentor',
        format => $pl->{format} || ($pl->{kind} eq 'staff' ? 'staff' : 'group'),
        provider => $pl->{provider} || 'custom',  # whereby | youtube | zoom | meet | streamyard | custom
        lesson => $pl->{lesson} || '',   # e.g. "7:elite" — chapter:difficulty
        startsAt => ($pl->{startsAt} || 0),
        capacity => ($pl->{capacity} || 0),
        calendarShare => ($pl->{calendarShare} ? JSON::PP::true : JSON::PP::false),
        bookings => [],   # students booking slots on the mentor calendar
        waiting => [],    # interview candidates in the waiting room
        host => $pl->{host} || 'Mentor',
        hostId => $pl->{hostId},
        broadcastUrl => $pl->{broadcastUrl} || '',
        note => $pl->{note} || '',
        status => $pl->{status} || 'scheduled',
        scheduledAt => ($pl->{scheduledAt} || 0),
        liveAt => (defined $pl->{status} && $pl->{status} eq 'live') ? time() : 0,
        endsAt => 0,
        chat => [],
        present => [],
        requests => [],   # students asking for a time with this mentor
        createdAt => time(),
      };
      push @$list, $room;
    }
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true, room => $room });
    close $c; return;
  }
  if ($method eq 'GET' && $clean eq '/os/api/challenge/leaderboard') {
    resp_json($c, 200, { boards => load_board() });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/challenge/leaderboard') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{challenge} || !defined $pl->{score}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'challenge and score required' });
      close $c; return;
    }
    my $boards = load_board();
    my $key = substr($pl->{challenge}, 0, 30);
    $boards->{$key} ||= [];
    push @{ $boards->{$key} }, {
      studentId => substr($pl->{studentId} || 'RFX-DEMO', 0, 24),
      name      => substr($pl->{name} || 'Student', 0, 60),
      score     => int($pl->{score}),
      verdict   => ($pl->{verdict} || 'REVIEW') eq 'PASS' ? 'PASS' : 'REVIEW',
      returnPct => int($pl->{returnPct} || 0),
      trades    => int($pl->{trades} || 0),
      at        => time(),
    };
    @{ $boards->{$key} } = sort { $b->{score} <=> $a->{score} } @{ $boards->{$key} };
    if (@{ $boards->{$key} } > 60) { @{ $boards->{$key} } = splice(@{ $boards->{$key} }, 0, 60); }
    save_board($boards);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms/chat') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{code} || !defined $pl->{msg} || $pl->{msg} eq '') {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'code and msg required' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
    if (!$room) { resp_json($c, 404, { ok => JSON::PP::false, reason => 'room not found' }); close $c; return; }
    my $msg = substr($pl->{msg}, 0, 400);
    # DLP — the same guard the client runs, enforced here so it holds even
    # if the client is bypassed. Hard categories (cards, national IDs,
    # wallet addresses, passwords) are rejected outright.
    my $dlp = dlp_hit($msg);
    if ($dlp) {
      # every blocked attempt lands on the incident board — who, where, why
      log_pii_incident({ room => $pl->{code}, name => $pl->{name}, role => $pl->{role}, reason => $dlp, sample => $msg });
      resp_json($c, 403, { ok => JSON::PP::false, reason => 'That message looks like ' . $dlp . ' — this chat is not private and staff never ask for that here.' });
      close $c; return;
    }
    push @{ $room->{chat} }, { name => $pl->{name} || 'Student', role => $pl->{role} || 'student', msg => $msg, ts => time() };
    if (@{ $room->{chat} } > 200) { @{ $room->{chat} } = splice(@{ $room->{chat} }, -200); }
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms/book') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{code} || !$pl->{name} || !$pl->{dateLabel}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'code, name and date required' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
    if (!$room) { resp_json($c, 404, { ok => JSON::PP::false, reason => 'room not found' }); close $c; return; }
    my $bk = {
      id => 'BK' . int(rand(90000) + 10000),
      name => $pl->{name}, who => $pl->{who} || '',
      dateLabel => substr($pl->{dateLabel}, 0, 60),
      timeLabel => substr($pl->{timeLabel} || 'Any time', 0, 40),
      priority => ($pl->{priority} ? JSON::PP::true : JSON::PP::false),
      status => 'pending', ts => time(), confirmedAt => 0, declinedAt => 0,
    };
    push @{ $room->{bookings} }, $bk;
    if (@{ $room->{bookings} } > 100) { @{ $room->{bookings} } = splice(@{ $room->{bookings} }, -100); }
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true, booking => $bk });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms/booking') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{code} || !$pl->{hostId} || !$pl->{id}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'code, hostId and id required' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
    if (!$room || $room->{hostId} ne $pl->{hostId}) { resp_json($c, 403, { ok => JSON::PP::false, reason => 'host only' }); close $c; return; }
    for my $bk (@{ $room->{bookings} || [] }) {
      if ($bk->{id} eq $pl->{id} && $bk->{status} eq 'pending') {
        if ($pl->{action} eq 'confirm') { $bk->{status} = 'confirmed'; $bk->{confirmedAt} = time(); }
        elsif ($pl->{action} eq 'decline') { $bk->{status} = 'declined'; $bk->{declinedAt} = time(); }
      }
    }
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms/wait') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{code} || !$pl->{name}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'code and name required' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
    if (!$room) { resp_json($c, 404, { ok => JSON::PP::false, reason => 'room not found' }); close $c; return; }
    my $in = grep { ($_->{who} || '') eq ($pl->{who} || '') && $_->{admittedAt} == 0 } @{ $room->{waiting} || [] };
    if (!$in) { push @{ $room->{waiting} }, { name => $pl->{name}, who => $pl->{who} || '', joinedAt => time(), admittedAt => 0 }; }
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms/admit') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{code} || !$pl->{hostId} || !$pl->{who}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'code, hostId and who required' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
    if (!$room || $room->{hostId} ne $pl->{hostId}) { resp_json($c, 403, { ok => JSON::PP::false, reason => 'host only' }); close $c; return; }
    for my $w (@{ $room->{waiting} || [] }) {
      if (($w->{who} || '') eq ($pl->{who} || '') && $w->{admittedAt} == 0) { $w->{admittedAt} = time(); }
    }
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms/request') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{code} || !defined $pl->{name} || $pl->{name} eq '') {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'code and name required' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
    if (!$room) { resp_json($c, 404, { ok => JSON::PP::false, reason => 'room not found' }); close $c; return; }
    my $want = substr($pl->{want} || 'Any time that suits the mentor', 0, 200);
    push @{ $room->{requests} }, { name => $pl->{name}, who => $pl->{who} || '', want => $want, ts => time() };
    if (@{ $room->{requests} } > 100) { @{ $room->{requests} } = splice(@{ $room->{requests} }, -100); }
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms/presence') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{code} || !$pl->{who}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'code and who required' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
    if (!$room) { resp_json($c, 404, { ok => JSON::PP::false, reason => 'room not found' }); close $c; return; }
    my $now = time();
    my $found = 0;
    for my $p (@{ $room->{present} }) {
      if ($p->{who} eq $pl->{who}) {
        $p->{lastSeen} = $now; $p->{name} = $pl->{name} || $p->{name}; $p->{role} = $pl->{role} || $p->{role}; $found = 1; last;
      }
    }
    push @{ $room->{present} }, { who => $pl->{who}, name => $pl->{name} || 'Student', role => $pl->{role} || 'student', joinedAt => $now, lastSeen => $now } unless $found;
    @{ $room->{present} } = grep { $now - $_->{lastSeen} < 75 } @{ $room->{present} };
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true, present => scalar(@{ $room->{present} }) });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/rooms/end') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{code} || !$pl->{hostId}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'code and hostId required' });
      close $c; return;
    }
    my $list = load_rooms();
    my $room;
    for my $r (@$list) { $room = $r if $r->{code} eq $pl->{code}; }
    if (!$room) { resp_json($c, 404, { ok => JSON::PP::false, reason => 'room not found' }); close $c; return; }
    if ($room->{hostId} ne $pl->{hostId}) { resp_json($c, 403, { ok => JSON::PP::false, reason => 'host only' }); close $c; return; }
    $room->{status} = 'ended';
    $room->{endsAt} = time();
    save_rooms($list);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }

  # --- Fair Play flags rail (OS -> moderator) ---
  # The OS client reports integrity flags (fast answers, suspicious perfect
  # scores); the moderator's SRM panel reads them and turns them into Trust
  # Bar moves. Dedup by (studentId, type, ch, qi): a re-sent flag is a no-op,
  # so retries can never double-penalise. CORS is on so the SRM page (another
  # port) can read the queue and post moderator decisions back.
  if ($method eq 'OPTIONS' && ($clean eq '/os/api/flags/report' || $clean eq '/os/api/flags/resolve')) {
    resp_json($c, 204, {});
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/flags/report') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{studentId} || ref($pl->{flags}) ne 'ARRAY') {
      resp_json($c, 400, { accepted => JSON::PP::false, reason => 'studentId and flags[] required' });
      close $c; return;
    }
    my $list = load_flags();
    my $added = 0;
    for my $f (@{ $pl->{flags} }) {
      next unless ref($f) eq 'HASH' && $f->{type};
      my $dup = 0;
      for my $x (@$list) {
        if ($x->{studentId} eq $pl->{studentId} && $x->{type} eq $f->{type} && ($x->{ch}||'') eq ($f->{ch}||'') && ($x->{qi}||'') eq ($f->{qi}||'')) { $dup = 1; last; }
      }
      next if $dup;
      push @$list, {
        id         => 'OSF-' . sprintf('%04d', scalar(@$list) + 1),
        studentId  => $pl->{studentId},
        type       => $f->{type},
        ch         => $f->{ch} || '',
        qi         => $f->{qi} || '',
        ms         => $f->{ms} || 0,
        ts         => $f->{ts} || time(),
        note       => $f->{note} || '',
        status     => 'pending',
        actions    => [],
        reportedAt => scalar(gmtime),
      };
      $added++;
    }
    save_flags($list) if $added;
    resp_json($c, 200, { accepted => JSON::PP::true, added => $added, total => scalar(@$list) });
    close $c; return;
  }
  if ($method eq 'GET' && $clean eq '/os/api/flags') {
    resp_json($c, 200, load_flags());
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/flags/resolve') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{id}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'flag id required' });
      close $c; return;
    }
    my $list = load_flags();
    my $found = 0;
    for my $x (@$list) {
      next unless $x->{id} eq $pl->{id};
      $found = 1;
      $x->{status} = $pl->{status} || 'dismissed';
      $x->{resolvedBy} = $pl->{resolvedBy} || 'Staff';
      $x->{resolvedAt} = scalar(gmtime);
      $x->{resolution} = $pl->{resolution} || '';
      push @{ $x->{actions} }, { status => $x->{status}, by => $x->{resolvedBy}, at => $x->{resolvedAt}, resolution => $x->{resolution} };
    }
    save_flags($list);
    resp_json($c, 200, { ok => ($found ? JSON::PP::true : JSON::PP::false) });
    close $c; return;
  }

  # --- single-session guard (see sessions_file above) ---
  if ($method eq 'POST' && $clean eq '/os/api/session/claim') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{studentId} || !$pl->{token} || !$pl->{deviceId}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'studentId, token and deviceId required' });
      close $c; return;
    }
    my $list = load_sessions();
    my $kicked = 0;
    # revoke every session of the OTHER devices for this student
    my @kept = grep { !($_->{studentId} eq $pl->{studentId} && $_->{deviceId} ne $pl->{deviceId}) } @$list;
    $kicked = 1 if @kept != @$list;
    # refresh this device's row for this token (multi-tab: keep other tokens)
    my $found = 0;
    for my $s (@kept) {
      if ($s->{studentId} eq $pl->{studentId} && $s->{deviceId} eq $pl->{deviceId} && $s->{token} eq $pl->{token}) {
        $s->{lastSeen} = time(); $found = 1;
      }
    }
    push @kept, { studentId => $pl->{studentId}, deviceId => $pl->{deviceId}, deviceType => $pl->{deviceType} || 'desktop', token => $pl->{token}, lastSeen => time() } unless $found;
    save_sessions(\@kept);
    resp_json($c, 200, { ok => JSON::PP::true, active => JSON::PP::true, kicked => ($kicked ? JSON::PP::true : JSON::PP::false) });
    close $c; return;
  }
  if ($method eq 'POST' && ($clean eq '/os/api/session/heartbeat' || $clean eq '/os/api/session/check')) {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{studentId} || !$pl->{token}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'studentId and token required' });
      close $c; return;
    }
    my $list = load_sessions();
    my $active = 0;
    for my $s (@$list) {
      if ($s->{studentId} eq $pl->{studentId} && $s->{token} eq $pl->{token}) {
        $active = 1;
        $s->{lastSeen} = time() if $clean eq '/os/api/session/heartbeat';
      }
    }
    save_sessions($list) if $clean eq '/os/api/session/heartbeat';
    resp_json($c, 200, { ok => JSON::PP::true, active => ($active ? JSON::PP::true : JSON::PP::false) });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/session/release') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{studentId} || !$pl->{token}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'studentId and token required' });
      close $c; return;
    }
    my @kept = grep { !($_->{studentId} eq $pl->{studentId} && $_->{token} eq $pl->{token}) } @{ load_sessions() };
    save_sessions(\@kept);
    resp_json($c, 200, { ok => JSON::PP::true });
    close $c; return;
  }

  # --- device trust store ("Is this really you?") ---
  # Mirror of the Netlify function: each verified student has a list of known
  # devices (fp fingerprints). A sign-in from an unrecognised device triggers
  # a challenge — a 6-digit code emailed to the student — and the device only
  # becomes known after the code is confirmed. On the local dev server the
  # mail rail is not configured, so the demo code rides back in the response
  # (demoCode), exactly like the production function without RESEND_API_KEY.
  if ($method eq 'POST' && $clean eq '/os/api/device/check') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{studentId} || !$pl->{fp}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'studentId and fp required' });
      close $c; return;
    }
    my $devs = load_devices($pl->{studentId});
    my $known = 0;
    for my $d (@$devs) { $known = 1 if $d->{fp} eq $pl->{fp}; }
    my @meta = map { { label => $_->{label} || '', location => $_->{location} || '', firstSeen => $_->{firstSeen}, lastSeen => $_->{lastSeen} } } @$devs;
    resp_json($c, 200, { ok => JSON::PP::true, known => ($known ? JSON::PP::true : JSON::PP::false), devices => \@meta, lastLocation => (@$devs ? ($devs->[-1]{location} || '') : '') });
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/device/challenge') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{studentId} || !$pl->{fp}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'studentId and fp required' });
      close $c; return;
    }
    my $code = int(rand(900000)) + 100000;
    my $list = load_challenges($pl->{studentId});
    push @$list, { fp => $pl->{fp}, code => $code, attempts => 0, label => substr($pl->{label} || 'New device', 0, 80), location => substr($pl->{location} || '', 0, 120), createdAt => time(), expiresAt => time() + 600 };
    splice(@$list, 0, @$list - 20) if @$list > 20;
    save_challenges($pl->{studentId}, $list);
    resp_json($c, 200, { ok => JSON::PP::true, codeSent => JSON::PP::false, demoCode => "$code", expiresAt => time() + 600 });
    close $c; return;
  }
  # --- machine self-report: the regression audit, served as JSON ---
  # The founder's audit status page (#/audit) polls this. It runs the same
  # audit-regression.pl that gates deploys, in JSON mode, and streams the
  # machine's own verdict — the building inspecting itself, live.
  #
  # The stamp problem, fixed: the audit is a ~20-second walk, the server forks
  # per connection, and the page polls every minute — so concurrent runs could
  # finish out of order and paint an OLDER "last run" over a newer one. Now the
  # completed result is cached (file + flock, so fork children never stampede),
  # the page gets it instantly, and the timestamp on the wall is always the
  # time the last audit actually completed. ?refresh=1 (the "Run the audit now"
  # button) forces a fresh walk past the cache.
  if ($method eq 'GET' && $clean eq '/os/api/audit') {
    my $force = ($path =~ /[?&]refresh=1(?:&|$)/) ? 1 : 0;
    my $cacheF = audit_cache_file();
    my $lockF = "$cacheF.lock";
    open my $lock, '>', $lockF or do { resp_json($c, 500, { ok => JSON::PP::false, fails => 1, checks => [], error => 'audit cache lock failed' }); close $c; return; };
    flock($lock, LOCK_EX);
    my $json = '';
    if (!$force && -f $cacheF) {
      open my $cf, '<:raw', $cacheF or die "can't read $cacheF";
      local $/; $json = <$cf>; close $cf;
      if ($json =~ /"atEpoch":\s*(\d+)/ && time() - $1 < 50) {
        # fresh enough — serve the last completed audit as-is
        print $c "HTTP/1.1 200\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nCache-Control: no-store\r\nContent-Length: " . length($json) . "\r\nConnection: close\r\n\r\n$json";
        close $lock; close $c; return;
      }
      $json = '';
    }
    my $audit = qx{cd "." && AUDIT_JSON=1 perl audit-regression.pl 2>/dev/null};
    if ($audit =~ /---AUDITJSON---\s*(\{.*\})/s) { $json = $1; }
    if (!$json) {
      $json = JSON::PP->new->utf8->encode({ at => scalar(localtime), atEpoch => time(), ok => JSON::PP::false, fails => 1, checks => [], error => 'audit engine unreachable' });
    } else {
      atomic_write($cacheF, $json);
    }
    close $lock;
    print $c "HTTP/1.1 200\r\n" .
      "Content-Type: application/json\r\n" .
      "Access-Control-Allow-Origin: *\r\n" .
      "Cache-Control: no-store\r\n" .
      "Content-Length: " . length($json) . "\r\nConnection: close\r\n\r\n$json";
    close $c; return;
  }
  if ($method eq 'POST' && $clean eq '/os/api/device/confirm') {
    my $body = read_body($c, $clen);
    my $pl = eval { JSON::PP->new->utf8->decode($body) };
    if (!$pl || !$pl->{studentId} || !$pl->{fp} || !$pl->{code}) {
      resp_json($c, 400, { ok => JSON::PP::false, reason => 'studentId, fp and code required' });
      close $c; return;
    }
    my $list = load_challenges($pl->{studentId});
    my $ch = undef;
    for my $x (reverse @$list) { if ($x->{fp} eq $pl->{fp}) { $ch = $x; last; } }
    if (!$ch) { resp_json($c, 200, { ok => JSON::PP::false, reason => 'no challenge — request a code first' }); close $c; return; }
    if ($ch->{expiresAt} < time()) { resp_json($c, 200, { ok => JSON::PP::false, reason => 'code expired — request a new one' }); close $c; return; }
    if ($ch->{attempts} >= 3) { resp_json($c, 200, { ok => JSON::PP::false, reason => 'too many wrong codes — request a new one' }); close $c; return; }
    if ("$ch->{code}" ne "$pl->{code}") {
      $ch->{attempts}++;
      save_challenges($pl->{studentId}, $list);
      resp_json($c, 200, { ok => JSON::PP::false, reason => 'wrong code — ' . (3 - $ch->{attempts}) . ' attempt' . ((3 - $ch->{attempts}) == 1 ? '' : 's') . ' left' });
      close $c; return;
    }
    my $devs = load_devices($pl->{studentId});
    my $now = time();
    my $found = 0;
    for my $d (@$devs) { if ($d->{fp} eq $pl->{fp}) { $d->{lastSeen} = $now; $found = 1; } }
    push @$devs, { fp => $pl->{fp}, label => $ch->{label}, location => $ch->{location}, firstSeen => $now, lastSeen => $now } unless $found;
    splice(@$devs, 0, @$devs - 12) if @$devs > 12;
    save_devices($pl->{studentId}, $devs);
    @$list = grep { !($_->{fp} eq $pl->{fp}) } @$list; # consume the challenge
    save_challenges($pl->{studentId}, $list);
    resp_json($c, 200, { ok => JSON::PP::true, reason => 'confirmed' });
    close $c; return;
  }

  # --- static file serving (same behaviour as static-server.pl) ---
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
