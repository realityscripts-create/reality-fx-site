use strict; use warnings;
open my $f, "<", ".freebuff/tools/ch2-elite-block.js" or die $!;
local $/; my $block = <$f>;
open my $d, "<", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
local $/; my $data = <$d>;

my $needle = 'id: 3, title: "Fundamental Analysis"';
my $pos = index($data, $needle);
die "anchor not found" if $pos < 0;
my $pre = substr($data, 0, $pos);
my $closePos = rindex($pre, "  },\n");
die "chapter close not found" if $closePos < 0;

my $clean = $block;
$clean =~ s/,\s*\z//;
$clean =~ s/\s+\z//;

my $insert = ",\n" . $clean . "\n";
my $out = substr($data, 0, $closePos) . $insert . substr($data, $closePos);
open my $o, ">", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
print $o $out;
print "spliced ch2 elite OK\n";
