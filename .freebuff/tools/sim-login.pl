#!/usr/bin/perl
# Replicates System-A-live/js/db.js findStudentByCode + memberLogin against the
# merged store to prove the founder can sign in with every credential form.
use strict;
use warnings;
use JSON::PP;

my $raw = do { local $/; open my $f, "<", ".freebuff/tools/system-a-state.json" or die; <$f> };
my $st  = JSON::PP->new->utf8->decode($raw);

sub findStudentByCode {
  my ($email, $code) = @_;
  $email = lc($email // '');
  $email =~ s/^\s+|\s+$//g;
  $code  = uc($code // '');
  $code  =~ s/^\s+|\s+$//g;
  $code  =~ s/^RFX-?//;
  return undef if !$email || !$code;
  for my $e (@{ $st->{enrollments} || [] }) {
    my $c1 = '';
    if ($e->{studentCode}) { $c1 = uc($e->{studentCode}); $c1 =~ s/^RFX-?//; }
    my $c2 = '';
    if ($e->{studentId})   { $c2 = uc($e->{studentId});   $c2 =~ s/^RFX-?//; }
    return $e if (($e->{payment}{email} // '') eq $email && ($c1 eq $code || $c2 eq $code));
  }
  return undef;
}

my @tests = (
  ['leeroychirwa18@gmail.com', 'V7P36F',   'Student Code (bare)'],
  ['leeroychirwa18@gmail.com', 'RFX-V7P36F','Student Code (prefixed)'],
  ['leeroychirwa18@gmail.com', '10482',    'Student ID (bare)'],
  ['leeroychirwa18@gmail.com', 'RFX-10482', 'Student ID (prefixed)'],
  ['LEEROYCHIRWA18@GMAIL.COM', 'v7p36f',   'Uppercase email + lowercase code'],
  ['naledi.k@example.com',     'N1K2L3',   'Naledi (demo student)'],
  ['naledi.k@example.com',     'RFX-10483','Naledi via Student ID'],
  ['wrong@example.com',        'V7P36F',   'Unknown email (should FAIL)'],
  ['leeroychirwa18@gmail.com', 'WRONG',    'Wrong code (should FAIL)'],
);
my $pass = 0;
for my $t (@tests) {
  my ($email, $code, $label) = @$t;
  my $found = findStudentByCode($email, $code);
  my $expect = ($label =~ /FAIL/) ? 0 : 1;
  my $got = $found ? 1 : 0;
  my $ok = ($got == $expect) ? 'PASS' : 'FAIL';
  $pass++ if $ok eq 'PASS';
  my $who = $found ? ($found->{studentId} . ' / ' . $found->{studentCode}) : '—';
  printf "  %-4s  %-42s -> %-14s %s\n", $ok, $label, $who, ($found ? '' : '(no match)');
}
print "\n$pass/", scalar(@tests), " credential tests pass\n";
