import type { AssistantPersonalizationProfile } from './types.ts';

type PromptProfile = {
  displayName: string | null;
  emergencyContactName: string | null;
  personalization: AssistantPersonalizationProfile;
};

const buildPersonalizationPromptBlock = ({
  preferences,
  goals,
}: AssistantPersonalizationProfile) => {
  const toneMap = {
    expert: 'chuyên gia',
    friendly: 'thân thiện',
    neutral: 'trung tính',
  } as const;
  const responseLengthMap = {
    detailed: 'chi tiết',
    medium: 'vừa',
    short: 'ngắn',
  } as const;
  const preferredBotName = preferences.chatbotName?.trim() || 'Trợ lý tư vấn sức khoẻ';
  const preferredAddressing = preferences.addressingStyle?.trim() || 'Hoàng Thượng';
  const profileLines = [
    `- Độ dài trả lời ưu tiên: ${responseLengthMap[preferences.responseLength ?? 'medium']}`,
    `- Giọng điệu ưu tiên: ${toneMap[preferences.tone ?? 'friendly']}`,
  ];
  const goalLines =
    goals.length > 0
      ? goals.map((goal, index) => `  ${index + 1}. ${goal}`)
      : ['  (chưa thiết lập mục tiêu)'];

  return [
    'CÁ NHÂN HOÁ (áp dụng cho câu trả lời mới):',
    'CÁCH XƯNG HÔ:',
    `- Gọi người dùng là: ${preferredAddressing}`,
    `- Trợ lý tự xưng là: ${preferredBotName}`,
    ...profileLines,
    '- Mục tiêu hiện tại:',
    ...goalLines,
  ].join('\n');
};

export const buildSystemPrompt = ({
  displayName,
  emergencyContactName,
  personalization,
}: PromptProfile) => {
  const preferredName = displayName?.trim() || 'bạn';
  const emergencyLine = emergencyContactName?.trim()
    ? ` + nhắc liên hệ ${emergencyContactName.trim()}`
    : '';
  const assistantName = personalization.preferences.chatbotName?.trim() || 'Tiểu Yến Tử';

  return [
    {
      type: 'text',
      text: [
        `Bạn là ${assistantName}, trợ lý sức khoẻ thân thiết của ${preferredName}.`,
        'Trả lời bằng tiếng Việt tự nhiên, ngắn gọn, ấm áp.',
        'Khi cần dữ liệu cá nhân, hãy gọi tool tương ứng thay vì đoán.',
        '',
        buildPersonalizationPromptBlock(personalization),
        '',
        'QUY TẮC AN TOÀN (BẮT BUỘC):',
        '- Nếu phát hiện tín hiệu cấp cứu (đau ngực dữ dội, khó thở, mất ý thức, đột quỵ, chảy máu không cầm, ngộ độc, ý nghĩ tự gây hại...), DỪNG tư vấn thông thường.',
        `- Trả về chính xác token "[[EMERGENCY]]" rồi nói ngắn gọn: "Hãy gọi 115 ngay"${emergencyLine}.`,
        '- Khi nói về liều thuốc / đổi thuốc, luôn kèm câu "hãy hỏi bác sĩ trước khi thay đổi".',
        '- Không bịa thông tin y khoa. Không biết thì nói không biết.',
      ].join('\n'),
      cache_control: {
        type: 'ephemeral',
      },
    },
  ];
};
