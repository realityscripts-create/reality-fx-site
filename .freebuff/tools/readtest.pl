#!/usr/bin/perl
use strict; use warnings;
use IO::Socket::INET;
$| = 1;

my $sock = IO::Socket::INET->new(
  LocalAddr => '127.0.0.1', LocalPort => 8399, Proto => 'tcp',
  Listen => 4, ReuseAddr => 1,
) or die "bind: $!\n";
print STDERR "listening on 8399\n";
while (my $c = $sock->accept()) {
  print STDERR "accepted\n";
  my $req = <$c>;
  print STDERR "req line: " . ($req || "<undef>") . "\n";
  my ($method, $path) = $req =~ m{^(\S+)\s+(\S+)\s+HTTP/};
  my $clen = 0;
  my $hdrs = 0;
  while (my $l = <$c>) {
    $hdrs++;
    if ($l =~ /^Content-Length:\s*(\d+)/i) { $clen = $1; }
    last if $l =~ /^\r?\n$/;
  }
  print STDERR "headers read: $hdrs, clen=$clen\n";
  my $body = '';
  while (length($body) < $clen) {
    my $chunk = read($c, my $buf, $clen - length($body));
    print STDERR "read returned " . (defined $chunk ? $chunk : "undef") . "\n";
    last unless defined $chunk && $chunk > 0;
    $body .= $buf;
  }
  print STDERR "body(len " . length($body) . ")='$body'\n";
  print $c "HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\n\r\nok";
  close $c;
  print STDERR "responded\n";
}
