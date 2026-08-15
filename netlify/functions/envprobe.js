// Diagnostic probe v2: reports whether site env vars reach a digest-uploaded function.
// (content bumped so the digest changes and the function is genuinely required)
exports.handler = async () => ({
  statusCode: 200,
  headers: { "content-type": "application/json", "cache-control": "no-store" },
  body: JSON.stringify({
    rfx: process.env.RFX_BLOBS_CONTEXT ? "present" : "missing",
    nbc: process.env.NETLIFY_BLOBS_CONTEXT ? "present" : "missing",
    aws: process.env.AWS_LAMBDA_FUNCTION_NAME || "no-lambda",
  }),
});
