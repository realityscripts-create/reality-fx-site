#!/usr/bin/perl
use strict; use warnings;
use JSON::PP;
my $raw = do { local $/; open my $f, "<", "/tmp/sysa-state.json" or die $!; <$f> };
my $j = JSON::PP->new->utf8->decode($raw);
$j->{staff} = [ grep { $_->{id} !~ /^STF-000[23]$/ } @{ $j->{staff} } ];
my $t1 = 'candidate1.rfx@gmail.com';
my $t2 = 'candidate2.rfx@gmail.com';
$j->{emails} = [ grep { my $to = $_->{to} || ''; $to ne $t1 && $to ne $t2 } @{ $j->{emails} || [] } ];
$j->{seq}{staff} = 1;
open my $o, ">", "/tmp/sysa-state.json" or die $!;
print $o JSON::PP->new->utf8->canonical->encode($j);
close $o;
print "staff now: ", scalar @{ $j->{staff} }, "\n";
