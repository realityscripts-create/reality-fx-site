#!/usr/bin/perl
use strict;
use warnings;
my $file = shift || die "usage: $0 file.js\n";
my $raw = do { local $/; open my $f, "<", $file or die $!; <$f> };
my @lines = split /\n/, $raw;
my ($depth, $inStr, $inTpl, $inLine, $inBlock, $sq) = (0,0,0,0,0);
my $ln = 0;
for my $line (@lines) {
  $ln++;
  my $i = 0; my $len = length $line;
  while ($i < $len) {
    my $ch = substr($line, $i, 1);
    if ($inBlock) { $inBlock = 0 if substr($line, $i, 2) eq "*/"; $i++; next; }
    if ($inLine) { last; }
    if (!$inStr && !$inTpl && !$sq) {
      if (substr($line, $i, 2) eq "/*") { $inBlock = 1; $i += 2; next; }
      if (substr($line, $i, 2) eq "//") { $inLine = 1; last; }
      if ($ch eq '"') { $inStr = 1; $i++; next; }
      if ($ch eq "'") { $sq = 1; $i++; next; }
      if ($ch eq '`') { $inTpl = 1; $i++; next; }
      $depth++ if $ch eq "{";
      $depth-- if $ch eq "}";
      if ($depth < 0) { print "line $ln: depth went negative ($depth)\n"; $depth = 0; }
      $i++; next;
    }
    if ($inStr) { if ($ch eq "\\") { $i += 2; next; } $inStr = 0 if $ch eq '"'; $i++; next; }
    if ($sq) { if ($ch eq "\\") { $i += 2; next; } $sq = 0 if $ch eq "'"; $i++; next; }
    if ($inTpl) { if ($ch eq "\\") { $i += 2; next; } if ($ch eq '`') { $inTpl = 0; } $i++; next; }
  }
}
print "final depth: $depth\n";
