#!/usr/bin/perl
# Enrich the seeded cohort in the System A store with FULL credentials and
# merit records, and remove the "Flag Demo" test artifact.
#
# Why: the Honours Room (Hall of Fame) in the OS reads the current-year wall
# live from /api/state enrollments that carry a `merit` record, and the SRM
# should show every simulated student as a complete, verified relationship
# record — so potential staff get familiar with real-looking students and the
# wall fills with anticipation instead of staying empty.
#
# Usage: perl enrich-cohort.pl <state-file> [--write]
#   (--write commits; without it the script prints a dry-run summary)
use strict;
use warnings;
use JSON::PP;
use utf8;   # source literals are UTF-8 — keep em-dashes intact through encode

my $file = shift @ARGV;
my $write = grep { $_ eq '--write' } @ARGV;
die "usage: perl enrich-cohort.pl <state-file> [--write]\n" unless $file;

sub slurp { my ($f) = @_; open my $fh, '<:raw', $f or die "open $f: $!"; local $/; my $r = <$fh>; close $fh; return $r; }
sub put { my ($f, $b) = @_; my $tmp = "$f.tmp"; open my $fh, '>:raw', $tmp or die "open $tmp: $!"; print $fh $b; close $fh; rename($tmp, $f) or die "rename: $!"; }

my $state = decode_json(slurp($file));
my @enr = @{ $state->{enrollments} || [] };

# ---- clean alphabet for student codes (no 0/O/1/I — readable aloud) ----
my @ABC = ('A'..'H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');
my @NUM = ('2'..'9');
my %taken = map { $_ => 1 } grep { defined } map { $_->{studentCode} } @enr;
sub gen_code {
  my $c;
  do { $c = join('', map { int(rand(2)) ? $ABC[int(rand(@ABC))] : $NUM[int(rand(@NUM))] } 1..6); } while ($taken{$c});
  $taken{$c} = 1;
  return $c;
}

my $now = sub { my ($d) = @_; $d =~ s/Z$//; return $d; };

# ---- the cohort: id => { enrichment } ----
# Founders of the current-year wall. Realistic in-progress numbers: nobody is
# at 100% yet — the summit stays open (that is the anticipation). Elite stays
# unclaimed this year, exactly like 2024.
my %cohort = (
  'sipho'  => { sid => 'RFX-10488', first => 'Sipho',  last => 'Ngubane',  dob => '1995-03-14', country => 'South Africa',
                email => 'sipho.ngubane@gmail.com', address => '12 Main Road, Sandton, Johannesburg, 2196', phone => '+27 82 555 0123',
                code => 'X4F7PB', course => 'Reality Academy — Professional Program', paidAt => '2026-08-08T22:56:18.715Z', tx => 'PP-1786229778714-99133',
                merit => { accuracy => 87, completionPct => 64, streak => 38, lane => 'challenging',
                           honour => 'Challenging lane leader this year', prize => 'Merit award — R2,500' },
                award => { amount => 2500, ref => 'AWARD-2026-001' } },
  'naledi' => { sid => 'RFX-10483', first => 'Naledi', last => 'Khumalo',  dob => '1998-11-02', country => 'South Africa',
                email => 'naledi.k@example.com', address => '8 Long Street, Cape Town, 8001', phone => '+27 82 123 4567',
                code => 'N1K2L3', course => 'Reality Academy - Professional Program', paidAt => '2026-08-09T00:20:00.000Z', tx => 'TXN-NALEDI-0001',
                merit => { accuracy => 91, completionPct => 72, streak => 51, lane => 'standard',
                           honour => 'Steadiest hand on the wall', prize => 'Merit award — R1,500' },
                award => { amount => 1500, ref => 'AWARD-2026-002' } },
  'zanele' => { sid => 'RFX-10484', first => 'Zanele', last => 'Dube',     dob => '2000-06-19', country => 'South Africa',
                email => 'zanele.dube@gmail.com', address => '45 Church Road, Durban, 4001', phone => '+27 83 555 0190',
                code => undef, course => 'RFX Full Course (13) + Virtual Mentor', paidAt => '2026-08-09T00:39:08.773Z', tx => 'PP-1786235947758-564875',
                merit => { accuracy => 84, completionPct => 45, streak => 22, lane => 'standard',
                           honour => 'Fastest riser — joined in March', prize => 'Merch crate' },
                award => undef },
  'thandiwe' => { sid => 'RFX-10485', first => 'Thandiwe', last => 'Mokoena', dob => '1997-09-27', country => 'South Africa',
                  email => 'thandiwe.mokoena@gmail.com', address => '221 George Avenue, Pretoria, 0002', phone => '+27 84 555 0140',
                  code => undef, course => 'RFX Full Course (13) + Virtual Mentor', paidAt => '2026-08-09T01:50:59.263Z', tx => 'STRIPE-1786240257327-620328',
                  merit => { accuracy => 82, completionPct => 38, streak => 19, lane => 'standard',
                             honour => 'Never missed a session this year', prize => 'Merit award — R750' },
                  award => { amount => 750, ref => 'AWARD-2026-003' } },
);

sub find_enr {
  my ($sid, $email) = @_;
  for my $x (@enr) {
    return $x if ($x->{studentId} && $x->{studentId} eq $sid) || ($x->{payment} && $x->{payment}{email} eq $email);
  }
  return undef;
}

my %wallets = map { ($_->{email} || '') => $_ } @{ $state->{wallets} || [] };
my $walletSeq = 0;
sub wallet_for {
  my ($email, $name) = @_;
  return $wallets{$email} if $wallets{$email};
  my $w = { walletNo => 'W-' . int(100000000 + rand(899999999)), name => $name, email => $email, ledger => [], currency => 'R', balance => 0 };
  $wallets{$email} = $w;
  return $w;
}

my $seq = $state->{seq} || {};
my $invoiceN = $seq->{invoice} || 48;
my $awardBase = '2026-08-09T00:00:00.000Z';

my @out;
for my $key (qw(sipho naledi zanele thandiwe)) {
  my $c = $cohort{$key};
  my $e = find_enr($c->{sid}, $c->{email});
  die "cohort member $key ($c->{sid}) not found in store\n" unless $e;
  my $code = $c->{code} || gen_code();
  my $at = $c->{paidAt};

  # full verified registration
  my $reg = $e->{registration} ||= {};
  $reg->{personal} = { country => $c->{country}, firstName => $c->{first}, fullName => "$c->{first} $c->{last}", dob => $c->{dob}, surname => $c->{last} };
  $reg->{identity} = { idNumber => '', address => $c->{address}, phone => $c->{phone} };
  $reg->{emailVerifiedAt}   = $at;
  $reg->{captchaPassedAt}   = $at;
  $reg->{termsAcceptedAt}   = $at;
  $reg->{agreementVersion}  = '2.0';
  $reg->{agreements} = [ { id => 'terms', name => 'Terms of Service', version => '2.0', acceptedAt => $at },
                         { id => 'content-protection', name => 'Content Protection & Trusted Printing', version => '1.0', acceptedAt => $at },
                         { id => 'referral', name => 'Referral & Marketing Policy', version => '1.0', acceptedAt => $at } ];
  $reg->{submittedAt} = $at;
  $reg->{selfieQuality} = 'ok';
  $reg->{identitySignals} = [];
  $reg->{decision} = { at => $at, by => 'Moderator', fixable => 0, verdict => 'APPROVED', reason => 'Identity verified' };
  $reg->{token} = 'cohort-' . lc($c->{first}) . '-token';
  $reg->{tokenCreatedAt} = $at;
  $reg->{tokenExpiresAt} = '2099-01-01T00:00:00.000Z';
  $reg->{verifyCode} = sprintf('%06d', 100000 + int(rand(899999)));

  $e->{studentCode} = $code;
  $e->{studentId}   = $c->{sid};
  $e->{state} = 'ACTIVE';
  $e->{invoice} = { issuedAt => $at, number => sprintf('INV-2026-%04d', ++$invoiceN), status => 'PAID' };
  $e->{handoff} = { confirmedAt => $at, lastError => undef, attempts => [] };
  $e->{printTrust} = { level => 'standard' };
  $e->{progress} = { registrationEmail => 1, purchase => 1, registrationSubmitted => 1, handoffConfirmed => 1, invoiceEmail => 1, approved => 1, active => 1 };
  $e->{trust} = { score => 90, restricted => 0, restrictedAt => undef, events => [ { reason => 'Identity established - approved', kind => 'credit', at => $at, delta => 0, by => 'System' } ] };
  $e->{merit} = $c->{merit};
  $e->{audit} ||= [];
  push @{ $e->{audit} },
    { at => $at, event => 'ENROLLMENT_CREATED', detail => 'Paid enrollment created from payment confirmation ' . $c->{tx} },
    { at => $at, event => 'REGISTRATION_INVITE_CREATED', detail => 'Secure link generated' },
    { at => $at, event => 'REGISTRATION_SUBMITTED', detail => 'Full registration — identity verified, agreements accepted' },
    { at => $at, event => 'DECISION_APPROVED', detail => 'Identity verified by Moderator' },
    { at => $at, event => 'HANDSHAKE_CONFIRMED', detail => 'RFX OS confirmed receipt' },
    { at => $at, event => 'MERIT_RECORDED', detail => $c->{merit}{accuracy} . '% accuracy · ' . $c->{merit}{completionPct} . '% completed · ' . $c->{merit}{streak} . 'd streak' };

  # wallet with prize money (merit awards never expire)
  my $w = wallet_for($c->{email}, "$c->{first} $c->{last}");
  if ($c->{award}) {
    $w->{balance} = $c->{award}{amount};
    $w->{ledger} = [ { at => $at, type => 'award', amount => $c->{award}{amount}, ref => $c->{award}{ref}, note => $c->{merit}{prize}, source => 'merit' } ];
    $state->{awards} ||= {};
    $state->{awards}{ $c->{award}{ref} } = { reference => $c->{award}{ref}, at => $at, by => 'System', reason => $c->{merit}{prize}, source => 'merit',
      total => $c->{award}{amount}, recipients => [ { email => $c->{email}, name => "$c->{first} $c->{last}", amount => $c->{award}{amount}, walletNo => $w->{walletNo}, balance => $w->{balance} } ] };
  }
  push @out, { key => $key, sid => $c->{sid}, code => $code, name => "$c->{first} $c->{last}", state => 'ACTIVE',
               merit => $c->{merit}, wallet => $w->{balance} };
}

# ---- remove the "Flag Demo" test artifact (only self-referenced) ----
my $before = scalar @enr;
@enr = grep { !($_->{id} && $_->{id} eq 'ENR-0026') } @enr;
my $removed = $before - scalar @enr;
$state->{enrollments} = \@enr;

# ---- wallets back into state ----
$state->{wallets} = [ values %wallets ];
$seq->{invoice} = $invoiceN;
$state->{seq} = $seq;
$state->{rev} = ($state->{rev} || 0) + 1;
$state->{schemaVersion} = 11;

print "cohort enriched: ", join(', ', map { "$_->{name} ($_->{sid} · $_->{code}) · ${\($_->{merit}{accuracy})}% / ${\($_->{merit}{completionPct})}% · wallet R$_->{wallet}" } @out), "\n";
print "flag-demo artifact removed: $removed\n" if $removed;

if ($write) {
  put($file, encode_json($state));
  print "written: $file\n";
} else {
  print "(dry run — pass --write to commit)\n";
}
