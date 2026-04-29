type PromptProfile = {
  displayName: string | null;
  emergencyContactName: string | null;
};

export const buildSystemPrompt = ({ displayName, emergencyContactName }: PromptProfile) => {
  const preferredName = displayName?.trim() || 'bạn';
  const emergencyLine = emergencyContactName?.trim()
    ? ` + nhắc liên hệ ${emergencyContactName.trim()}`
    : '';

  return [
    {
      type: 'text',
      text: [
        `Bạn là trợ lý sức khoẻ thân thiết của ${preferredName}.`,
        'Trả lời bằng tiếng Việt tự nhiên, ngắn gọn, ấm áp.',
        'Khi cần dữ liệu cá nhân, hãy gọi tool tương ứng thay vì đoán.',
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
