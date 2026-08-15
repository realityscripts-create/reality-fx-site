#!/usr/bin/perl
use strict;
use warnings;
my $file = shift || die "usage: $0 file.js\n";
my $raw = do { local $/; open my $f, "<", $file or die $!; <$f> };
my @lines = split /\n/, $raw;
my ($o, $c, $bo, $bc) = (0,0,0,0);
my ($inStr, $inTpl, $inLine, $inBlock, $sq) = (0,0,0,0,0);
for my $line (@lines) {
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
      $o++ if $ch eq "{"; $c++ if $ch eq "}";
      $bo++ if $ch eq "["; $bc++ if $ch eq "]";
      $i++; next;
    }
    if ($inStr) { if ($ch eq "\\") { $i += 2; next; } $inStr = 0 if $ch eq '"'; $i++; next; }
    if ($sq) { if ($ch eq "\\") { $i += 2; next; } $sq = 0 if $ch eq "'"; $i++; next; }
    if ($inTpl) { if ($ch eq "\\") { $i += 2; next; } if ($ch eq '`') { $inTpl = 0; } $i++; next; }
  }
}
my $ok = ($o == $c && $bo == $bc) ? "OK" : "MISMATCH";
print "$file braces $o/$c brackets $bo/$bc -> $ok\n";
exit($ok eq "OK" ? 0 : 1);
