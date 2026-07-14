import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.json();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Missing required fields'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid email address'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify reCAPTCHA token
    if (!formData.recaptchaToken) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'reCAPTCHA verification is required'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const recaptchaSecret = '6LfU3CYsAAAAACHNCnTr8f5PTwjCAOWN8BamEf2U';
    const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    const recaptchaResponse = await fetch(recaptchaVerifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${recaptchaSecret}&response=${formData.recaptchaToken}`,
    });

    const recaptchaResult = await recaptchaResponse.json();

    if (!recaptchaResult.success) {
      console.error('reCAPTCHA verification failed:', recaptchaResult);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'reCAPTCHA verification failed. Please try again.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email using Resend API
    const resendApiKey = 're_d7gGtJcd_PFZz6ZP7VT2YStHZ5c7CUcry';
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">New Contact Form Submission</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">ATEK IT Website</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Contact Information</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="140" style="color: #6b7280; font-size: 14px; font-weight: 600;">Name:</td>
                        <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${formData.firstName} ${formData.lastName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="140" style="color: #6b7280; font-size: 14px; font-weight: 600;">Email:</td>
                        <td style="color: #1f2937; font-size: 14px;">
                          <a href="mailto:${formData.email}" style="color: #667eea; text-decoration: none; font-weight: 500;">${formData.email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${formData.phone ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="140" style="color: #6b7280; font-size: 14px; font-weight: 600;">Phone:</td>
                        <td style="color: #1f2937; font-size: 14px;">
                          <a href="tel:${formData.phone}" style="color: #667eea; text-decoration: none; font-weight: 500;">${formData.phone}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                ${formData.company ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="140" style="color: #6b7280; font-size: 14px; font-weight: 600;">Company:</td>
                        <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${formData.company}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                ${formData.service ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="140" style="color: #6b7280; font-size: 14px; font-weight: 600;">Service:</td>
                        <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${formData.service}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="140" style="color: #6b7280; font-size: 14px; font-weight: 600;">Subject:</td>
                        <td style="color: #1f2937; font-size: 14px; font-weight: 500;">${formData.subject}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Message:</h3>
              <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
              </div>
              
              <!-- Quick Actions -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 0 10px;">
                          <a href="mailto:${formData.email}" style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply via Email</a>
                        </td>
                        ${formData.phone ? `
                        <td style="padding: 0 10px;">
                          <a href="tel:${formData.phone}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Call Client</a>
                        </td>
                        ` : ''}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">This email was sent from the ATEK IT contact form</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} ATEK IT, Inc. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ATEK IT Contact Form <noreply@atekit.com>',
        to: ['info@atekit.com', 'prajam@atekit.com', 'rahulpradeepan55@gmail.com'],
        subject: `New Contact Form: ${formData.subject}`,
        html: emailHtml,
        reply_to: formData.email,
      }),
    });

    const responseData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', responseData);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Resend API Error: ${responseData.message || 'Failed to send email'}`,
          error: responseData
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully:', responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send message. Please try again.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

