# Security

- Validate every input at the system boundary; never trust client data.
- Never log secrets, tokens, or `.env` contents.
- Never commit or print `DATABASE_URL` or any credential.
- Never build SQL or shell commands via string concatenation with user input.
- Treat every card/resource as globally accessible; don't assume hidden trust boundaries that don't exist.
- Keep dependencies free of known critical vulnerabilities; don't add packages without checking for known issues.
