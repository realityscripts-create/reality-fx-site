#!/usr/bin/env perl
# Gate lock-test stub — answers /api/gate with locked:true so the OS's
# gate rail (heartbeat pill + sessClaim lock card) can be lock-tested live.
# Never touches System A's real fork (8125). Port 8126.
use strict;
use warnings;
use IO::Socket::INET;
use Time::Piece;

my $port = shift(@ARGV) // 8126;
my $mins = shift(@ARGV) // 2;

my $server = IO::Socket::INET->new(
  LocalPort => $port, ReuseAddr => 1, Listen => 16, Proto => 'tcp'
) or die "cannot bind $port: $!\n";

sub hdr {
  my ($code, $ctype, $len) = @_;
  return "HTTP/1.1 $code OK\r\nContent-Type: $ctype\r\nContent-Length: $len\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n";
}

while (my $c = $server->accept()) {
  my $req = '';
  while (my $line = <$c>) {
    $req .= $line;
    last if $line =~ /^\r?\n$/;
    last if length($req) > 4096;
  }
  my ($path) = $req =~ /^GET\s+(\S+)/;
  $path ||= '/';
  if ($path =~ m{^/api/gate}) {
    my $now = time;
    my $until = $now + $mins * 60;
    my $dt = localtime($until)->datetime;
    my $body = qq({"locked":true,"minutesLeft":$mins,"lockedUntil":"$dt"});
    print $c hdr(200, 'application/json', length($body)), $body;
  } elsif ($path =~ m{^/member\.html|^/$}) {
    my $body = '<html><body style="background:#0d0d0d;color:#c5a86d;font-family:sans-serif;padding:40px"><h2>Stub member portal (lock-test)</h2><p>Forgot password? — recovery lives here in the real build.</p></body></html>';
    print $c hdr(200, 'text/html', length($body)), $body;
  } else {
    my $body = '{}';
    print $c hdr(200, 'application/json', length($body)), $body;
  }
  close $c;
}
