import QRCode from 'qrcode.react';
import styled from 'styled-components';
import { format } from 'date-fns';
import {
  HiOutlineArrowDownTray,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineDocument,
  HiOutlineQrCode,
  HiOutlineTag,
} from 'react-icons/hi2';

import DataItem from '../../ui/DataItem';
import Button from '../../ui/Button';
import Tag from '../../ui/Tag';
import { getIcon } from '../../utils/helpers';

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
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const Tags = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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

const statusToTagName = {
  file: 'blue',
  قرار: 'green',
  implemented: 'silver',
  ignored: 'red',
};

// A purely presentational component
function DocumentDataBox({ document }) {
  const { createdAt, subject, type, tags, notes, file } = document;

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

  return (
    <>
      <StyledMailingDataBox>
        <Header>
          <div>
            {/* <HiOutlineDocumentText /> */}
            {getIcon(type)}
            <p>{subject}</p>
          </div>
        </Header>

        <Section>
          <DataItem icon={<HiOutlineDocument />} label='Type'>
            {type}
          </DataItem>
          <DataItem icon={<HiOutlineTag />} label='Tags'>
            <Tags>
              {tags.map((tag, i) => (
                <Tag type={statusToTagName[tag]} key={i}>
                  {tag}
                </Tag>
              ))}
            </Tags>
          </DataItem>

          {
            <DataItem
              icon={<HiOutlineChatBubbleBottomCenterText />}
              label='Observations'
            >
              {notes ? notes : 'There are no observations for this mail'}
            </DataItem>
          }

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
            {' Created at '}
            {format(new Date(createdAt), 'EEE, MMM dd yyyy, p')}
          </p>
        </Footer>
      </StyledMailingDataBox>

      <StyledObject>
        {file && (
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
      </StyledObject>
    </>
  );
}

export default DocumentDataBox;
