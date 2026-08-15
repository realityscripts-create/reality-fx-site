#!/usr/bin/perl
# Minimal static file server for local preview (no dependencies).
# Usage: perl static-server.pl <root-dir> <port>
use strict;
use warnings;
use IO::Socket::INET;

my $root = shift @ARGV || ".";
my $port = shift @ARGV || 8910;
$root =~ s/\\/\//g;
$root =~ s{/+$}{};

my %mime = (
  html=>'text/html; charset=utf-8', htm=>'text/html; charset=utf-8',
  css=>'text/css; charset=utf-8', js=>'application/javascript; charset=utf-8',
  json=>'application/json', png=>'image/png', jpg=>'image/jpeg', jpeg=>'image/jpeg',
  gif=>'image/gif', svg=>'image/svg+xml', webp=>'image/webp', ico=>'image/x-icon',
  pdf=>'application/pdf', txt=>'text/plain; charset=utf-8', md=>'text/plain; charset=utf-8',
  woff2=>'font/woff2', woff=>'font/woff', ttf=>'font/ttf', otf=>'font/otf',
  mp4=>'video/mp4', webm=>'video/webm', mp3=>'audio/mpeg', wasm=>'application/wasm',
);

my $server = IO::Socket::INET->new(
  LocalAddr => '127.0.0.1', LocalPort => $port, ReuseAddr => 1,
  Listen => 32, Proto => 'tcp'
) or die "bind $port failed: $!\n";

print STDERR "serving $root on 127.0.0.1:$port\n";
$SIG{CHLD} = 'IGNORE';

while (my $client = $server->accept()) {
  my $pid = fork();
  if (defined $pid && $pid == 0) { serve($client, $root); exit 0; }
  close $client;
}

sub serve {
  my ($c, $root) = @_;
  my $req = <$c>;
  if (!defined $req) { close $c; return; }
  my ($method, $path) = $req =~ m{^(\S+)\s+(\S+)\s+HTTP/};
  close $c and return unless $method;
  while (my $l = <$c>) { last if $l =~ /^\r?\n$/; }

  my $rel = $path;
  $rel =~ s/\?.*$//;
  $rel =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/eg;
  $rel = '/index.html' if $rel eq '/' || $rel eq '';

  my $abs = "$root$rel";
  if ($abs !~ m{^\Q$root\E(/|$)}) { resp($c, 403, 'text/plain', 'forbidden'); close $c; return; }
  $abs = "$abs/index.html" if -d $abs;

  if (-f $abs) {
    open my $fh, '<:raw', $abs or do { resp($c, 500, 'text/plain', 'read error'); close $c; return; };
    my $size = -s $abs;
    my ($ext) = $abs =~ /\.([A-Za-z0-9]+)$/;
    my $ct = $mime{lc($ext||'')} || 'application/octet-stream';
    print $c "HTTP/1.1 200 OK\r\nContent-Type: $ct\r\nContent-Length: $size\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n";
    my $buf;
    while (read $fh, $buf, 65536) { print $c $buf; }
    close $fh;
  } else {
    resp($c, 404, 'text/plain', 'not found');
  }
  close $c;
}

sub resp {
  my ($c, $code, $ct, $body) = @_;
  print $c "HTTP/1.1 $code X\r\nContent-Type: $ct\r\nContent-Length: " . length($body) . "\r\nConnection: close\r\n\r\n$body";
}
