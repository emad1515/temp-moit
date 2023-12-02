import QRCode from 'qrcode.react';
import styled from 'styled-components';
import { useState } from 'react';
import { format, isToday } from 'date-fns';
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineArrowPath,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineDocumentArrowDown,
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentText,
  HiOutlineMegaphone,
  HiOutlinePaperAirplane,
  HiOutlinePrinter,
  HiOutlineQrCode,
  HiOutlineViewfinderCircle,
} from 'react-icons/hi2';

import DataItem from '../../ui/DataItem';
import Button from '../../ui/Button';
import DataItemEmail from '../../ui/DataItemEmail';
import Reciept from '../pdfForms/Reciept';
import Modal from '../../ui/Modal';
import ConfirmSend from '../../ui/ConfirmSend';
import { useSendMailing } from './useSendMailing';
import { formatDistanceFromNow } from '../../utils/helpers';

const StyledMailingDataBox = styled.section`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    /* font-family: 'Sono'; */
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const Person = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

const StyledQRCode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
`;

const StyledObject = styled.div`
  display: flex;
  flex-direction: column;
`;

const DisplayDocuments = styled.section`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  display: flex;
  justify-content: space-around;

  padding-top: 1rem;
  padding-bottom: 1rem;
`;

// A purely presentational component
function MailingDataBox({ mailing }) {
  const { sendEmail } = useSendMailing();

  const [showFile, setShowFile] = useState(false);
  const [showInstructionsFile, setShowInstructionsFile] = useState(false);
  const [showReceiptLocal, setShowReceiptLocal] = useState(false);
  const [showReceiptExternal, setShowReceiptExternal] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(false);

  const {
    createdAt,
    subject,
    type,
    sender: {
      jobTitle: senderJobTitle,
      name: senderName,
      email: senderEmail,
      phone: senderPhone,
    },
    receiver: {
      jobTitle: receiverJobTitle,
      name: receiverName,
      email: receiverEmail,
      phone: receiverPhone,
    },
    startDate,
    endDate,
    responseDays,
    status,
    refNum,
    theirRefNum,
    deliveredBy,
    notes,
    file,
    receiptLocal,
    receiptExternal,
    instructionsFile,
    listOfCc,
  } = mailing;

  const downloadQRCode = () => {
    const qrCodeURL = document
      .getElementById('qrCodeEl')
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    let aEl = document.createElement('a');
    aEl.href = qrCodeURL;
    aEl.download = 'QR_Code.png';
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };

  // Prepare names of people for rendering on screen
  const renderCc = listOfCc?.map(
    contact =>
      `${contact?.jobTitle} :  ${contact?.email ? contact?.email : ' no email'}`
  );

  // Prepare emails of people for sending
  const cc = listOfCc
    ?.filter(contact => contact?.email)
    .map(contact => contact?.email)
    .join('; ');

  const hasEmail = receiverEmail || cc?.length > 0;

  return (
    <>
      <StyledMailingDataBox>
        <Header>
          <div>
            {type === 'outgoing' ? (
              <HiOutlineDocumentArrowUp />
            ) : (
              <HiOutlineDocumentArrowDown />
            )}

            <p>{subject}</p>
          </div>

          {startDate && (
            <p>
              {format(new Date(startDate), 'EEE, MMM dd yyyy')} (
              {isToday(new Date(startDate))
                ? 'Today'
                : formatDistanceFromNow(startDate)}
              ) &mdash; {format(new Date(endDate), 'EEE, MMM dd yyyy')}
            </p>
          )}
        </Header>

        <Section>
          {type === 'outgoing' ? (
            <Person>
              <p>{receiverJobTitle}</p>
              {receiverName && (
                <>
                  <span>&bull;</span>
                  <p>{receiverName}</p>
                </>
              )}

              {receiverEmail && (
                <>
                  <span>&bull;</span>
                  <p>{receiverEmail}</p>
                </>
              )}
              {receiverPhone && (
                <>
                  <span>&bull;</span>
                  <p>{receiverPhone}</p>
                </>
              )}

              {hasEmail && file && (
                <DataItemEmail
                  icon={<HiOutlinePaperAirplane />}
                  label='Send via email'
                >
                  <Modal>
                    <Modal.Open opens='send'>
                      <Button variation='danger'>Send Mailing</Button>
                    </Modal.Open>
                    <Modal.Window name='send'>
                      <ConfirmSend
                        resourceName='mailing'
                        onConfirm={() =>
                          sendEmail({
                            receiverEmail,
                            subject,
                            type,
                            refNum,
                            file,
                            cc,
                          })
                        }
                      />
                    </Modal.Window>
                  </Modal>
                </DataItemEmail>
              )}
            </Person>
          ) : (
            <Person>
              <p>{senderJobTitle}</p>
              {/* <span>&bull;</span> */}
              {senderName && (
                <>
                  <span>&bull;</span>
                  <p>{senderName}</p>
                </>
              )}
              {senderEmail && (
                <>
                  <span>&bull;</span>
                  <p>{senderEmail}</p>
                </>
              )}
              {senderPhone && (
                <>
                  <span>&bull;</span>
                  <p>{senderPhone}</p>
                </>
              )}
              {/* <p>ID {senderId}</p> */}
            </Person>
          )}

          {/* {type === 'outgoing' && listOfCc?.length > 0 ? ( */}
          {listOfCc?.length > 0 ? (
            renderCc.map((cc, i) => (
              <DataItem
                key={i}
                icon={<HiOutlineDocumentDuplicate />}
                label='Cc'
              >
                {cc}
              </DataItem>
            ))
          ) : (
            <DataItem icon={<HiOutlineDocumentDuplicate />} label='Cc'>
              There are no people on the list
            </DataItem>
          )}

          <DataItem icon={<HiOutlineArrowPath />} label='Response days'>
            {responseDays
              ? responseDays > 1
                ? `${responseDays} days`
                : `${responseDays} day`
              : 'This mailing has not yet been referred to specialists'}
          </DataItem>

          {status && (
            <DataItem
              icon={<HiOutlineChatBubbleBottomCenterText />}
              label='Observations'
            >
              {notes ? notes : 'There are no observations for this mail'}
            </DataItem>
          )}

          <DataItem icon={<HiOutlineViewfinderCircle />} label='Their ref num'>
            {theirRefNum ? theirRefNum : 'Not specified'}
          </DataItem>

          {type === 'outgoing' && (
            <DataItem icon={<HiOutlineCheckCircle />} label='Delivered by'>
              {deliveredBy ? deliveredBy : 'Not specified'}
            </DataItem>
          )}

          <DataItem icon={<HiOutlineQrCode />} label='QRCode'>
            {file ? (
              <StyledQRCode>
                <QRCode id='qrCodeEl' value={file} />
                <Button size='small' onClick={downloadQRCode}>
                  <HiOutlineArrowDownTray size={'2.2rem'} />
                </Button>
              </StyledQRCode>
            ) : (
              'Please upload the document'
            )}
          </DataItem>
        </Section>

        <Footer>
          <p>
            {type === 'outgoing' ? 'Sent' : 'Received'}{' '}
            {format(new Date(createdAt), 'EEE, MMM dd yyyy, p')}
          </p>
        </Footer>
      </StyledMailingDataBox>

      <DisplayDocuments>
        {file && (
          <Button onClick={() => setShowFile(show => !show)}>
            <HiOutlineDocumentText size={'2.2rem'} />
          </Button>
        )}
        {instructionsFile && (
          <Button onClick={() => setShowInstructionsFile(show => !show)}>
            <HiOutlineMegaphone size={'2.2rem'} />
          </Button>
        )}
        {receiptLocal && (
          <Button onClick={() => setShowReceiptLocal(show => !show)}>
            <HiOutlineArrowLeftOnRectangle size={'2.2rem'} />
          </Button>
        )}
        {receiptExternal && (
          <Button onClick={() => setShowReceiptExternal(show => !show)}>
            <HiOutlineArrowRightOnRectangle size={'2.2rem'} />
          </Button>
        )}
        {type === 'outgoing' && (
          <Button onClick={() => setPrintReceipt(show => !show)}>
            <HiOutlinePrinter size={'2.2rem'} />
          </Button>
        )}
      </DisplayDocuments>

      <StyledObject>
        {printReceipt && (
          <Reciept
            refNum={refNum}
            subject={subject}
            receiverJobTitle={receiverJobTitle}
          />
        )}

        {showFile && (
          <object
            data={file}
            type='application/pdf'
            width='100%'
            height='1188px'
          >
            <p>
              Alternative text - include a link <a href={file}>to the PDF!</a>
            </p>
          </object>
        )}
        {showInstructionsFile && (
          <object
            data={instructionsFile.concat('?#zoom300')}
            type='application/pdf'
            width='100%'
            height='1188px'
          >
            <p>
              Alternative text - include a link{' '}
              <a href={instructionsFile}>to the PDF!</a>
            </p>
          </object>
        )}
        {showReceiptLocal && (
          <object
            data={receiptLocal}
            type='application/pdf'
            width='100%'
            height='1188px'
          >
            <p>
              Alternative text - include a link{' '}
              <a href={receiptLocal}>to the PDF!</a>
            </p>
          </object>
        )}
        {showReceiptExternal && (
          <object
            data={receiptExternal}
            type='application/pdf'
            width='100%'
            height='1188px'
          >
            <p>
              Alternative text - include a link{' '}
              <a href={receiptExternal}>to the PDF!</a>
            </p>
          </object>
        )}
      </StyledObject>
    </>
  );
}

export default MailingDataBox;
