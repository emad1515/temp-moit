import styled from 'styled-components';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import MailingDataBox from '../mailings/MailingDataBox';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import CheckboxOffice from '../../ui/CheckboxOffice';
import Form from '../../ui/Form';
import FileInput from '../../ui/FileInput';

import {
  calcDaysPassed,
  styleRefNum,
  toISOStringWithTimezone,
} from '../../utils/helpers';
import { useUpdateMailing } from '../mailings/useUpdateMailing';
import { useMoveBack } from '../../hooks/useMoveBack';
import { useMailing } from '../mailings/useMailing';

const OfficeBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;

  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const StyledOfficeBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  align-items: start;
  gap: 2.4rem;

  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

const FormUpload = styled.form`
  display: flex;
  padding: 2.4rem 4rem;

  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
  font-size: 1.4rem;
`;

function CreatFormOffice({ officeToUpdate = {} }) {
  const { isTreating, ...updateValues } = officeToUpdate;
  const isUpdateSession = isTreating;

  const { isUpdating, updateMail } = useUpdateMailing();
  const { mailing } = useMailing();
  const { register, handleSubmit, formState } = useForm({
    defaultValues: isUpdateSession
      ? {
          ...updateValues,
          endDate: format(new Date(officeToUpdate.endDate), 'yyyy-MM-dd'),
        }
      : {},
  });

  const { errors } = formState;
  const moveBack = useMoveBack();

  const {
    _id: mailingId,
    type,
    refNum,
    sender: { _id: senderId },
    receiver: { _id: receiverId },
  } = mailing;

  function onSubmit(data) {
    const startDate = !mailing.startDate
      ? toISOStringWithTimezone(new Date())
      : mailing.startDate;

    const endDate = toISOStringWithTimezone(new Date(data.endDate));
    const responseDays = calcDaysPassed(endDate, startDate);

    const instructionsFile =
      typeof data?.instructionsFile !== 'string'
        ? data?.instructionsFile[0]
        : undefined;
    const receiptLocal =
      typeof data?.receiptLocal !== 'string'
        ? data?.receiptLocal[0]
        : undefined;
    const receiptExternal =
      typeof data?.receiptExternal !== 'string'
        ? data?.receiptExternal[0]
        : undefined;

    updateMail({
      newMailData: {
        ...data,
        sender: senderId,
        receiver: receiverId,
        refNum,
        instructionsFile,
        receiptLocal,
        receiptExternal,
        startDate,
        endDate,
        responseDays,
        type,
        status: 'processing',
        isTreating: 'true',
      },
      id: mailingId,
    });
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>Process mailing #{styleRefNum(type, refNum)}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <MailingDataBox mailing={mailing} />

      <FormUpload>
        <FormRow label='Instructions File'>
          <FileInput
            id='instructionsFile'
            accept='.pdf'
            {...register('instructionsFile')}
          />
        </FormRow>
      </FormUpload>

      <FormUpload>
        <FormRow label='Receipt (Local)'>
          <FileInput
            id='receiptLocal'
            accept='.pdf'
            {...register('receiptLocal')}
          />
        </FormRow>
      </FormUpload>

      <FormUpload>
        <FormRow label='Receipt (External)'>
          <FileInput
            id='receiptExternal'
            accept='.pdf'
            {...register('receiptExternal')}
          />
        </FormRow>
      </FormUpload>

      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        {type === 'outgoing' && (
          <OfficeBox>
            <FormRow label='Delivered by' error={errors?.deliveredBy?.message}>
              <Input
                type='text'
                id='deliveredBy'
                {...register('deliveredBy')}
              />
            </FormRow>
          </OfficeBox>
        )}

        <OfficeBox>
          <FormRow label='Deadline' error={errors?.endDate?.message}>
            <Input
              type='date'
              id='endDate'
              {...register('endDate', {
                required: 'This field is required',
              })}
            />
          </FormRow>
        </OfficeBox>
        {/* <OfficeBox>
          <FormRow label='Respones days' error={errors?.responseDays?.message}>
            <Input
              type='number'
              id='responseDays'
              defaultValue={1}
              {...register('responseDays', {
                required: 'This field is required',
                min: {
                  value: 1,
                  message: 'Response days shouls be at least 1',
                },
              })}
            />
          </FormRow>
        </OfficeBox> */}

        <StyledOfficeBox>
          <CheckboxOffice
            id='ministerOffice'
            registerfield={{ ...register('ministerOffice') }}
          >
            مكتب الوزير
          </CheckboxOffice>

          <CheckboxOffice
            id='viceOffice'
            registerfield={{ ...register('viceOffice') }}
          >
            مكتب نائب الوزير
          </CheckboxOffice>

          <CheckboxOffice
            id='deputyOffice'
            registerfield={{ ...register('deputyOffice') }}
          >
            مكتب الوكيل
          </CheckboxOffice>

          <CheckboxOffice
            id='deputyIndustryOffice'
            registerfield={{ ...register('deputyIndustryOffice') }}
          >
            وكيل الوزارة لقطاع الصناعة
          </CheckboxOffice>

          <CheckboxOffice
            id='deputyInternalTradeOffice'
            registerfield={{ ...register('deputyInternalTradeOffice') }}
          >
            وكيل الوزارة لقطاع التجارة الداخلية
          </CheckboxOffice>

          <CheckboxOffice
            id='deputyForeignTradeOffice'
            registerfield={{ ...register('deputyForeignTradeOffice') }}
          >
            وكيل الوزارة لقطاع التجارة الخارجية وتنمية الصادرات
          </CheckboxOffice>

          <CheckboxOffice
            id='deputyBusinessServicesOffice'
            registerfield={{ ...register('deputyBusinessServicesOffice') }}
          >
            وكيل الوزارة لقطاع خدمات الأعمال
          </CheckboxOffice>

          <CheckboxOffice
            id='technicalOffice'
            registerfield={{ ...register('technicalOffice') }}
          >
            المكتب الفني
          </CheckboxOffice>

          <CheckboxOffice
            id='ministryOfficesInTheGovernorates'
            registerfield={{ ...register('ministryOfficesInTheGovernorates') }}
          >
            الإدارة العامة لمكاتب الوزارة في أمانة العاصمة والمحافظات
          </CheckboxOffice>

          <CheckboxOffice
            id='internalAuditOffice'
            registerfield={{ ...register('internalAuditOffice') }}
          >
            الإدارة العامة للمراجعة الداخلية
          </CheckboxOffice>

          <CheckboxOffice
            id='publicBodiesInstitutionsAndMixedCompaniesOffice'
            registerfield={{
              ...register('publicBodiesInstitutionsAndMixedCompaniesOffice'),
            }}
          >
            الإدارة العامة للهيئات والمؤسسات العامة والشركات المختلطة والتنظيمات
            المهنية
          </CheckboxOffice>

          <CheckboxOffice
            id='hrOffice'
            registerfield={{ ...register('hrOffice') }}
          >
            الإدارة العامة لتنمية الموارد البشرية
          </CheckboxOffice>

          <CheckboxOffice
            id='womanOffice'
            registerfield={{ ...register('womanOffice') }}
          >
            الإدارة العامة للمرأة
          </CheckboxOffice>

          <CheckboxOffice
            id='legalAffairsOffice'
            registerfield={{ ...register('legalAffairsOffice') }}
          >
            الإدارة العامة للشؤون القانونية
          </CheckboxOffice>

          <CheckboxOffice
            id='planningAndInformationOffice'
            registerfield={{ ...register('planningAndInformationOffice') }}
          >
            الإدارة العامة للتخطيط والمعلومات
          </CheckboxOffice>

          <CheckboxOffice
            id='financialAffairsOffice'
            registerfield={{ ...register('financialAffairsOffice') }}
          >
            الإدارة العامة للشؤون المالية والتجهيزات
          </CheckboxOffice>

          <CheckboxOffice
            id='publicRelationsAndMediaOffice'
            registerfield={{ ...register('publicRelationsAndMediaOffice') }}
          >
            الإدارة العامة للعلاقات العامة والإعلام
          </CheckboxOffice>

          <CheckboxOffice
            id='informationSystemsOffice'
            registerfield={{ ...register('informationSystemsOffice') }}
          >
            الإدارة العامة لنظم المعلومات
          </CheckboxOffice>

          <CheckboxOffice
            id='coordinationWtoOffice'
            registerfield={{ ...register('coordinationWtoOffice') }}
          >
            مكتب الاتصال والتنسيق مع منظمة التجارة العالمية
          </CheckboxOffice>

          <CheckboxOffice
            id='industrialAreasOffice'
            registerfield={{ ...register('industrialAreasOffice') }}
          >
            الإدارة العامة للمناطق الصناعية
          </CheckboxOffice>

          <CheckboxOffice
            id='industrialDevelopmentAndInvestmentOffice'
            registerfield={{
              ...register('industrialDevelopmentAndInvestmentOffice'),
            }}
          >
            الإدارة العامة للتنمية الصناعية والاستثمار
          </CheckboxOffice>

          <CheckboxOffice
            id='industrialControlOffice'
            registerfield={{ ...register('industrialControlOffice') }}
          >
            الإدارة العامة للرقابة الصناعية
          </CheckboxOffice>

          <CheckboxOffice
            id='smallIndustriesOffice'
            registerfield={{ ...register('smallIndustriesOffice') }}
          >
            الإدارة العامة للصناعات الصغيرة
          </CheckboxOffice>

          <CheckboxOffice
            id='marketStabilityOffice'
            registerfield={{ ...register('marketStabilityOffice') }}
          >
            الإدارة العامة لاستقرار الأسواق
          </CheckboxOffice>

          <CheckboxOffice
            id='consumerProtectionOffice'
            registerfield={{ ...register('consumerProtectionOffice') }}
          >
            الإدارة العامة لحماية المستهلك
          </CheckboxOffice>

          <CheckboxOffice
            id='competitionAndMonopolyPreventionOffice'
            registerfield={{
              ...register('competitionAndMonopolyPreventionOffice'),
            }}
          >
            الإدارة العامة للمنافسة ومنع الاحتكار
          </CheckboxOffice>

          <CheckboxOffice
            id='operationsRoomOffice'
            registerfield={{ ...register('operationsRoomOffice') }}
          >
            غرفة العمليات
          </CheckboxOffice>

          <CheckboxOffice
            id='internationalBusinessRelationsOffice'
            registerfield={{
              ...register('internationalBusinessRelationsOffice'),
            }}
          >
            الإدارة العامة للعلاقات التجاريةالدولية
          </CheckboxOffice>

          <CheckboxOffice
            id='exportDevelopmentOffice'
            registerfield={{ ...register('exportDevelopmentOffice') }}
          >
            الإدارة العامة لتنمية الصادرات
          </CheckboxOffice>

          <CheckboxOffice
            id='protectingNationalProductsOffice'
            registerfield={{ ...register('protectingNationalProductsOffice') }}
          >
            الإدارة العامة لحماية المنتجات الوطنية
          </CheckboxOffice>

          <CheckboxOffice
            id='commercialAgreementsAndCommercialZonesOffice'
            registerfield={{
              ...register('commercialAgreementsAndCommercialZonesOffice'),
            }}
          >
            الإدارة العامة للاتفاقيات والمناطق التجارية
          </CheckboxOffice>

          <CheckboxOffice
            id='companiesOffice'
            registerfield={{ ...register('companiesOffice') }}
          >
            الإدارة العامة للشركات
          </CheckboxOffice>

          <CheckboxOffice
            id='agenciesOffice'
            registerfield={{ ...register('agenciesOffice') }}
          >
            الإدارة العامة للوكالات وفروع الشركات والبيوت الأجنبية
          </CheckboxOffice>

          <CheckboxOffice
            id='commercialRegisterOffice'
            registerfield={{ ...register('commercialRegisterOffice') }}
          >
            الإدارة العامة للسجل التجاري والأسماء التجارية
          </CheckboxOffice>

          <CheckboxOffice
            id='trademarksOffice'
            registerfield={{ ...register('trademarksOffice') }}
          >
            الإدارة العامة لحماية الملكية الفكرية والعلامات
          </CheckboxOffice>

          <CheckboxOffice
            id='regulatingTheAuditingAndAuditingProfessionOffice'
            registerfield={{
              ...register('regulatingTheAuditingAndAuditingProfessionOffice'),
            }}
          >
            الإدارة العامة لتنظيم مهنة تدقيق ومراجعة الحسابات
          </CheckboxOffice>

          <CheckboxOffice
            id='insuranceCompaniesOffice'
            registerfield={{ ...register('insuranceCompaniesOffice') }}
          >
            الإدارة العامة لشركات التأمين
          </CheckboxOffice>

          <CheckboxOffice
            id='customersServiceOffice'
            registerfield={{ ...register('customersServiceOffice') }}
          >
            الإدارة العامة لخدمة العملاء
          </CheckboxOffice>
        </StyledOfficeBox>

        <FormRow>
          <ButtonGroup>
            <Button disabled={isUpdating}>Process mailing #{refNum}</Button>

            <Button variation='secondary' type='reset' onClick={moveBack}>
              Back
            </Button>
          </ButtonGroup>
        </FormRow>
      </Form>
    </>
  );
}

export default CreatFormOffice;
