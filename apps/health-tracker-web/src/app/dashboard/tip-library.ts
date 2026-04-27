import { DateTime } from 'luxon';

import type { CyclePhase } from './cycle-utils';

const PHASE_TIPS: Record<CyclePhase, string[]> = {
  menstrual: [
    'Hãy nghỉ ngơi và chăm sóc bản thân. Một chút trà ấm và thư giãn là hoàn toàn xứng đáng hôm nay.',
    'Ưu tiên uống đủ nước và ăn thực phẩm giàu sắt để cơ thể phục hồi nhẹ nhàng hơn.',
    'Nếu thấy mệt, cứ giảm nhịp sinh hoạt và dành thêm thời gian lắng nghe cơ thể.',
  ],
  follicular: [
    'Năng lượng đang trở lại. Đây là lúc tốt để bắt đầu những thói quen mới hoặc vận động nhẹ.',
    'Bạn có thể thấy đầu óc sáng rõ và tập trung hơn trong giai đoạn này.',
    'Tận dụng cảm giác thoải mái hiện tại để làm những việc bạn yêu thích nhất.',
  ],
  fertile: [
    'Theo dõi nhiệt độ cơ thể buổi sáng để xác nhận thời điểm rụng trứng chính xác hơn.',
    'Nếu đang mong có thai, đây là thời điểm phù hợp để chú ý sát hơn đến tín hiệu cơ thể.',
    'Giữ tinh thần nhẹ nhàng và ngủ đủ giấc cũng là cách hỗ trợ sức khỏe sinh sản tốt hơn.',
  ],
  luteal: [
    'Các món giàu magie như hạt và rau lá xanh có thể giúp cơ thể dễ chịu hơn trong giai đoạn này.',
    'Nếu thấy căng thẳng hoặc mệt hơn, đó là phản ứng khá thường gặp của hormone.',
    'Đi bộ ngắn hoặc yoga nhẹ có thể giúp giảm cảm giác ì và khó chịu trước kỳ kinh.',
  ],
};

export const pickTip = (phase: CyclePhase, today: DateTime): string => {
  const tips = PHASE_TIPS[phase];
  return tips[today.ordinal % tips.length];
};
