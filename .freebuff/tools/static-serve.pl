#!/usr/bin/perl
# Minimal static file server (core modules only) — for verifying PWA wiring.
# Usage: perl static-serve.pl <root-dir> <port>
use strict;
use warnings;
use IO::Socket::INET;
use File::Spec;

my ($root, $port) = @ARGV;
$root ||= '.';
$port ||= 8000;

my %MIME = (
  '.html' => 'text/html; charset=utf-8',
  '.js'   => 'application/javascript; charset=utf-8',
  '.css'  => 'text/css; charset=utf-8',
  '.png'  => 'image/png',
  '.json' => 'application/json; charset=utf-8',
  '.svg'  => 'image/svg+xml',
  '.webp' => 'image/webp',
  '.ico'  => 'image/x-icon',
  '.txt'  => 'text/plain; charset=utf-8',
);

my $server = IO::Socket::INET->new(LocalAddr => "127.0.0.1", LocalPort => $port,
  Listen => 32, ReuseAddr => 1, Proto => 'tcp') or die "bind: $!";
print "serving $root on http://127.0.0.1:$port\n";

while (my $client = $server->accept()) {
  my $peer = $client->peerhost();
  my $req = <$client>;
  $req ||= '';
  while (<$client>) { last if /^\r?$/; }
  my ($method, $path) = $req =~ m{^(\w+)\s+(\S+)} or do { $client->close(); next; };
  if ($method eq 'GET' || $method eq 'HEAD') {
    $path =~ s/\?.*//;
    $path = '/index.html' if $path eq '/';
    # simple traversal guard
    $path = File::Spec->canonpath($path);
    next if $path =~ m{\.\.};
    my $file = File::Spec->catfile($root, $path =~ s{^/}{}r);
    if (-f $file) {
      my $ext = ($file =~ /(\.[^.\/]+)$/)[0] || '';
      my $ct  = $MIME{$ext} || 'application/octet-stream';
      open(my $fh, '<:raw', $file) or next;
      my $data = do { local $/; <$fh> };
      close($fh);
      print $client "HTTP/1.1 200 OK\r\nContent-Type: $ct\r\nContent-Length: " . length($data) . "\r\nConnection: close\r\n\r\n";
      print $client $data unless $method eq 'HEAD';
    } else {
      print $client "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
    }
  } else {
    print $client "HTTP/1.1 501 Not Implemented\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
  }
  $client->close();
}
