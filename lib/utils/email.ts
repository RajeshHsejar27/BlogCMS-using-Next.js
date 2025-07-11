import nodemailer from 'nodemailer';

/**
 * Email transporter configuration
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send email notification for post rejection
 * @param to - Recipient email
 * @param postTitle - Title of the rejected post
 * @param reason - Rejection reason
 */
export async function sendRejectionEmail(
  to: string,
  postTitle: string,
  reason: string
): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: `Post Rejected: ${postTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Post Submission Update</h2>
        <p>Unfortunately, your post <strong>"${postTitle}"</strong> has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please review the feedback and feel free to resubmit with improvements.</p>
        <p>Best regards,<br>The Forest Blog Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

/**
 * Send email notification for post approval
 * @param to - Recipient email
 * @param postTitle - Title of the approved post
 * @param postSlug - Slug of the approved post
 */
export async function sendApprovalEmail(
  to: string,
  postTitle: string,
  postSlug: string
): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: `Post Approved: ${postTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #228B22;">Post Approved!</h2>
        <p>Congratulations! Your post <strong>"${postTitle}"</strong> has been approved and is now live.</p>
        <p><a href="${process.env.NEXTAUTH_URL}/posts/${postSlug}" style="color: #228B22;">View your post</a></p>
        <p>Best regards,<br>The Forest Blog Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}