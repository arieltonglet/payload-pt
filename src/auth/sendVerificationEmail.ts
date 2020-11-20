async function sendVerificationEmail(args) {
  // Verify token from e-mail
  const {
    config,
    sendEmail,
    collection: {
      config: collectionConfig,
    },
    user,
    disableEmail,
    req,
    token,
  } = args;

  if (!disableEmail) {
    const defaultVerificationURL = `${config.serverURL}${config.routes.admin}/${collectionConfig.slug}/verify/${token}`;

    let html = `A new account has just been created for you to access <a href="${config.serverURL}">${config.serverURL}</a>.
    Please click on the following link or paste the URL below into your browser to verify your email:
    <a href="${defaultVerificationURL}">${defaultVerificationURL}</a><br>
    After verifying your email, you will be able to log in successfully.`;

    // Allow config to override email content
    if (typeof collectionConfig.auth.verify.generateEmailHTML === 'function') {
      html = await collectionConfig.auth.verify.generateEmailHTML({
        req,
        token,
        user,
      });
    }

    let subject = 'Verify your email';

    // Allow config to override email subject
    if (typeof collectionConfig.auth.verify.generateEmailSubject === 'function') {
      subject = await collectionConfig.auth.verify.generateEmailSubject({
        req,
        token,
        email: user.email,
      });
    }

    sendEmail({
      from: `"${config.email.fromName}" <${config.email.fromAddress}>`,
      to: user.email,
      subject,
      html,
    });
  }
}

module.exports = sendVerificationEmail;