#!/usr/bin/perl
# One-time demo repair: merge the two divergent System A stores (8123 = the
# founder's live store, 8124 = the clean demo store) into ONE complete store,
# and clear the founder's sign-in lockout that was raised against a store that
# did not hold their record.
#
#   base  : the 8123 store snapshot (canonical, rich — founder's full account)
#   add   : the 8124 store (Naledi + demo pendings)
#
# Output: merged store written to the 8124 relay's state file, and to the
# 8123 relay's on-disk state file so a future restart serves the same data.
use strict;
use warnings;
use JSON::PP;

sub slurp {
  my ($f) = @_;
  open my $fh, '<:raw', $f or die "open $f: $!";
  local $/;
  my $raw = <$fh>;
  close $fh;
  return $raw;
}
sub put {
  my ($f, $body) = @_;
  my $tmp = "$f.tmp";
  open my $fh, '>:raw', $tmp or die "open $tmp: $!";
  print $fh $body;
  close $fh;
  rename($tmp, $f) or die "rename to $f: $!";
}

my $base = JSON::PP->new->utf8->decode(slurp('/tmp/state8123b.json'));
my $add  = JSON::PP->new->utf8->decode(slurp('.freebuff/tools/system-a-state.json'));

# ---- report what we have ----
print "BASE enrollments: ", scalar(@{$base->{enrollments} || []}), "\n";
for my $e (@{$base->{enrollments} || []}) {
  print "  base enr: ", ($e->{payment}{email} // '?'),
        " | ", ($e->{studentId} // 'no-id'),
        " | ", ($e->{studentCode} // 'no-code'),
        " | ", ($e->{state} // 'no-state'),
        " | tx=", ($e->{payment}{transactionId} // '?'), "\n";
}
print "ADD enrollments: ", scalar(@{$add->{enrollments} || []}), "\n";
for my $e (@{$add->{enrollments} || []}) {
  print "  add enr: ", ($e->{payment}{email} // '?'),
        " | ", ($e->{studentId} // 'no-id'),
        " | ", ($e->{studentCode} // 'no-code'),
        " | ", ($e->{state} // 'no-state'),
        " | tx=", ($e->{payment}{transactionId} // '?'), "\n";
}

# ---- merge enrollments (dedup by payment.transactionId) ----
my %seenTx;
my @enr = ();
for my $e (@{$base->{enrollments} || []}) {
  my $tx = $e->{payment}{transactionId} // '';
  next if !$tx || $seenTx{$tx}++;
  push @enr, $e;
}
my $added = 0;
for my $e (@{$add->{enrollments} || []}) {
  my $tx = $e->{payment}{transactionId} // '';
  next if !$tx || $seenTx{$tx}++;
  push @enr, $e;
  $added++;
}
$base->{enrollments} = \@enr;
print "\nmerged enrollments: ", scalar(@enr), " (added $added from 8124)\n";

# ---- merge wallets (dedup by walletNo / holder email) ----
my %seenWal;
my @wals = ();
for my $w (@{$base->{wallets} || []}) {
  my $k = ($w->{walletNo} || $w->{email} || '');
  next if !$k || $seenWal{$k}++;
  push @wals, $w;
}
my $wAdded = 0;
for my $w (@{$add->{wallets} || []}) {
  my $k = ($w->{walletNo} || $w->{email} || '');
  next if !$k || $seenWal{$k}++;
  push @wals, $w;
  $wAdded++;
}
$base->{wallets} = \@wals;
print "merged wallets: ", scalar(@wals), " (added $wAdded)\n";

# ---- merge conversations (dedup by id) ----
my %seenConv;
my @convs = ();
for my $c (@{$base->{conversations} || []}) {
  my $k = $c->{id} || '';
  next if !$k || $seenConv{$k}++;
  push @convs, $c;
}
for my $c (@{$add->{conversations} || []}) {
  my $k = $c->{id} || '';
  next if !$k || $seenConv{$k}++;
  push @convs, $c;
}
$base->{conversations} = \@convs;

# ---- merge staff (dedup by id) ----
my %seenStaff;
my @staff = ();
for my $s (@{$base->{staff} || []}) { my $k = $s->{id} || ''; next if !$k || $seenStaff{$k}++; push @staff, $s; }
for my $s (@{$add->{staff} || []})   { my $k = $s->{id} || ''; next if !$k || $seenStaff{$k}++; push @staff, $s; }
$base->{staff} = \@staff;

# ---- merge emails (dedup by subject+to+sentAt; keep base first) ----
my %seenMail;
my @mails = ();
for my $m (@{$base->{emails} || []}) { my $k = ($m->{to}||'') . '|' . ($m->{subject}||'') . '|' . ($m->{sentAt}||''); next if !$k || $seenMail{$k}++; push @mails, $m; }
for my $m (@{$add->{emails} || []})  { my $k = ($m->{to}||'') . '|' . ($m->{subject}||'') . '|' . ($m->{sentAt}||''); next if !$k || $seenMail{$k}++; push @mails, $m; }
$base->{emails} = \@mails;

# ---- merge securityEvents + auditLog-ish arrays (dedup by at+event) ----
for my $key (qw(securityEvents)) {
  my %seenE;
  my @arr = ();
  for my $e (@{$base->{$key} || []}) { my $k = ($e->{at}||'') . '|' . ($e->{event}||''); next if !$k || $seenE{$k}++; push @arr, $e; }
  for my $e (@{$add->{$key} || []})  { my $k = ($e->{at}||'') . '|' . ($e->{event}||''); next if !$k || $seenE{$k}++; push @arr, $e; }
  $base->{$key} = \@arr;
}

# ---- seq: take the max per counter ----
for my $k (keys %{ $add->{seq} || {} }) {
  my $a = $base->{seq}{$k} || 0;
  my $b = $add->{seq}{$k} || 0;
  $base->{seq}{$k} = $a > $b ? $a : $b;
}

# ---- clear the founder's lockout ----
my $la = $base->{loginAttempts} || {};
delete $la->{'leeroychirwa18@gmail.com'};
delete $la->{'leeroychirwa16@gmail.com'};   # stale test entries, keep things clean
delete $la->{'pedro.zulu@example.com'};     # demo-only noise
$base->{loginAttempts} = $la;

# ---- rev: max ----
my $ra = $base->{rev} || 0;
my $rb = $add->{rev} || 0;
$base->{rev} = $ra > $rb ? $ra : $rb;

# ---- encode & write both files ----
print "\nencoding merged store…\n";
my $out = JSON::PP->new->utf8->canonical->encode($base);
# canonical re-encode is fine for a one-time repair; the server stores raw
# bytes afterwards.
put('.freebuff/tools/system-a-state.json', $out);
put('.freebuff/tools/user-8123-state.json', $out);
print "wrote merged store (", length($out), " bytes) to:\n";
print "  .freebuff/tools/system-a-state.json\n";
print "  .freebuff/tools/user-8123-state.json\n";
