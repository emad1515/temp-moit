import {
  Document,
  Font,
  Image,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import almaraiRegular from '/src/font/Almarai-Regular.ttf';
import almaraiLight from '/src/font/Almarai-Light.ttf';
import almaraiBold from '/src/font/Almarai-Bold.ttf';
import almaraiBlack from '/src/font/Almarai-ExtraBold.ttf';
import { format } from 'date-fns';

Font.register({
  family: 'almarai',
  fonts: [
    { src: almaraiRegular },
    { src: almaraiLight, fontWeight: 'light' },
    { src: almaraiBold, fontWeight: 'bold' },
    { src: almaraiBlack, fontWeight: 'heavy' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'almarai',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.5,
    marginVertical: 10,
    paddingHorizontal: 30,

    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#4f46e5',
  },
  logoEagle: {
    height: 65,
    marginTop: 9,
    marginBottom: 10,
  },
  logoFont: {
    textAlign: 'right',
    width: 107,
  },
  miniLogo: {
    flexDirection: 'column',
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  ministiry: {
    marginTop: 2,
  },

  date: {
    flexDirection: 'column',
    textAlign: 'right',
    gap: 5,

    marginTop: 20,
    marginBottom: 40,
  },
  content: {
    flexDirection: 'column',
    gap: 30,
    textAlign: 'right',
  },
  heading: {
    fontWeight: 'black',
    marginHorizontal: 140,
    paddingVertical: 5,
    textAlign: 'center',
    color: '#f9fafb',
    backgroundColor: '#4f46e5',
  },
  formRow: {
    flexDirection: 'row-reverse',
  },
  label: {
    flexBasis: 70,
  },
  input: {
    fontWeight: 'light',
  },
  singture: {
    textAlign: 'left',
    marginTop: 30,
    marginLeft: 80,
  },
  mb: {
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,

    paddingTop: 5,
    fontSize: 8.5,
    marginTop: 60,

    borderTop: '1px',
    borderTopStyle: 'solid',
    borderTopColor: '#4f46e5',
  },
  footerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 12,
    width: 12,
  },
  footerLabel: {
    fontWeight: 'light',
    paddingTop: 2,
    paddingLeft: 2,
  },
});

function Reciept({ refNum, subject, receiverJobTitle }) {
  const date = format(new Date(), 'MMM dd yyyy');

  return (
    <PDFViewer width='100%' height='863px'>
      <Document>
        <Page size='A5' style={styles.page}>
          <View style={styles.header}>
            <Image src='/شعار النسر الجمهوري.png' style={styles.logoEagle} />
            <View style={styles.miniLogo}>
              <Image
                src='/مخطوطة الجمهورية اليمنية.png'
                style={styles.logoFont}
              />

              <Text style={styles.ministiry}>وزارة الصناعة والتجارة</Text>
              <Text>إدارة السكرتارية والتوثيق</Text>
            </View>
          </View>
          <View>
            <View style={styles.date}>
              <View style={styles.formRow}>
                <Text style={styles.label}>:التاريخ</Text>
                <Text style={styles.input}>{date}</Text>
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>:رقم المرجع</Text>
                <Text style={styles.input}>{refNum}</Text>
              </View>
            </View>
            <View style={styles.content}>
              <View>
                <Text style={styles.heading}>سند استلام</Text>
              </View>
              <View>
                <View style={styles.formRow}>
                  <Text style={styles.label}>:المرسل إليه</Text>
                  <Text style={styles.input}>{receiverJobTitle}</Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.label}>:الموضوع</Text>
                  <Text style={styles.input}>{subject}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.mb}>:اسم المستلم</Text>
                <Text style={styles.mb}>:المسمى الوظيفي</Text>
                <Text style={styles.mb}>:رقم الهاتف</Text>
                <Text style={styles.mb}>:الإيميل</Text>
                <Text style={styles.mb}>:التاريخ</Text>
                <Text style={styles.singture}>التوقيع</Text>
              </View>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.footerGroup}>
              <Image src='/click.png' style={styles.icon} />

              <Text style={styles.footerLabel}>www.moit-ye.com</Text>
            </View>
            <View style={styles.footerGroup}>
              <Image src='/mail.png' style={styles.icon} />

              <Text style={styles.footerLabel}>info@moit-ye.com</Text>
            </View>
            <View style={styles.footerGroup}>
              <Image src='/rotary-dial-telephone.png' style={styles.icon} />

              <Text style={styles.footerLabel}>02-245089</Text>
            </View>
            <View style={styles.footerGroup}>
              <Image src='/line.png' style={styles.icon} />

              <Text style={styles.footerLabel}>
                عدن - التواهي - جولة الشيخ إسحاق
              </Text>
              <Image
                src='/location.png'
                style={[styles.icon, { paddingLeft: 2 }]}
              />
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default Reciept;
