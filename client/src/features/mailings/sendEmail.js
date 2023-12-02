import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { HiOutlineMinusSmall } from 'react-icons/hi2';
import { styleRefNum } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

export const sendEmail = function ({
  receiverEmail,
  subject,
  type,
  refNum,
  file,
  cc,
}) {
  // In case there is not receiverEmail we make all cc list in main mail
  const to = receiverEmail || cc;
  const Cc = receiverEmail ? cc : '';

  // EmailJS service ID, template ID, and Public key
  const serviceId = 'service_kpfug3n';
  const templateId = 'template_4jdnz7r';
  const publicKey = 'ZcCZKC0qFps3zKgZx';

  const message = `
  مرفق لكم مذكرتنا ذات الرقم 
  (${styleRefNum(type, refNum)}) 
  بشأن موضوع ${subject} يرجى تأكيد الاستلام
  `;

  // Create a new object that contains dynamic template params
  const templateParams = {
    // toEmail: to,
    toEmail: 'azal7777@hotmail.com',
    subject,
    message: message,
    file: file,
    replyTo: 'emad.mhs89@gmail.com',
    // cc: Cc,
    cc: 'emad.mhs89@outlook.com',
  };

  console.log(receiverEmail, subject, type, refNum, file, cc);

  emailjs.send(serviceId, templateId, templateParams, publicKey).then(
    function (response) {
      toast.success(`Mail #${styleRefNum(type, refNum)} successfully Sent`);

      console.log('Email sent successfully!', response.status, response.text);
    },
    function (error) {
      toast.error('There was an error while sending');
      console.log('FAILED...', error);
    }
  );
};
