#!/usr/bin/perl
use strict; use warnings;
use JSON::PP;

my $f = '.freebuff/tools/system-a-state.json';
open my $fh, '<:raw', $f or die "open: $!";
my $raw = do { local $/; <$fh> };
close $fh;
my $d = eval { JSON::PP->new->utf8->decode($raw) };
die "decode failed: $@" if $@;

my @keep;
for my $e (@{ $d->{enrollments} || [] }) {
    my $email = lc(($e->{payment} || {})->{email} || '');
    push @keep, $e unless $email eq 'quote.check@realityfx.local';
}
$d->{enrollments} = \@keep;
# also drop any email/mailbox entries for the test address
my @emails;
for my $m (@{ $d->{emails} || [] }) {
    next unless $m;
    next if (lc($m->{to} || '') eq 'quote.check@realityfx.local');
    push @emails, $m;
}
$d->{emails} = \@emails;

my $out = JSON::PP->new->utf8->canonical->pretty->encode($d);
open my $of, '>:raw', $f or die "write: $!";
print $of $out;
close $of;
print "cleaned — enrollments now " . scalar(@{ $d->{enrollments} }) . "\n";
