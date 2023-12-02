import {
  HiOutlineArrowPath,
  HiOutlineArrowUpRight,
  HiOutlineDocument,
  HiOutlineEnvelope,
} from 'react-icons/hi2';
import Stat from './Stat';

function Stats({
  mailings,
  startedProcessing,
  outgoingMailings,
  incomingMailings,
}) {
  // 1)
  const numMailings = mailings?.length;

  // 2)
  const processing = startedProcessing?.length;

  // 3)
  const outgoing = outgoingMailings?.length;

  // 4)
  const incoming = incomingMailings?.length;

  return (
    <>
      <Stat
        title='documents'
        color='blue'
        icon={<HiOutlineDocument />}
        value={numMailings}
      />
      <Stat
        title='processing'
        color='green'
        icon={<HiOutlineArrowPath />}
        value={processing}
      />
      <Stat
        title='outgoing'
        color='indigo'
        icon={<HiOutlineArrowUpRight />}
        value={outgoing}
      />
      <Stat
        title='incoming'
        color='yellow'
        icon={<HiOutlineEnvelope />}
        value={incoming}
      />
    </>
  );
}

export default Stats;
