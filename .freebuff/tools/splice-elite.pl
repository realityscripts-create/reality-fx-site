use strict; use warnings;
open my $f, "<", ".freebuff/tools/ch1-elite-block.js" or die $!;
local $/; my $block = <$f>;
open my $d, "<", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
local $/; my $data = <$d>;

my $needle = 'id: 2, title: "Fx Terminology & Concepts"';
my $pos = index($data, $needle);
die "anchor not found" if $pos < 0;
my $pre = substr($data, 0, $pos);
# ch1's closing "  }," is the LAST one before chapter 2
my $closePos = rindex($pre, "  },\n");
die "chapter close not found" if $closePos < 0;

# the block ends with its own trailing comma — elite becomes the LAST key of ch1
my $clean = $block;
$clean =~ s/,\s*\z//;   # drop trailing comma
$clean =~ s/\s+\z//;    # trim trailing whitespace

my $insert = ",\n" . $clean . "\n";
my $out = substr($data, 0, $closePos) . $insert . substr($data, $closePos);
open my $o, ">", "REALITY-FOREX-TRADING-/os/js/data.js" or die $!;
print $o $out;
print "spliced OK\n";
