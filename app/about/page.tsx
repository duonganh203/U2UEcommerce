"use client";

import { useState } from "react";

// QA Accordion Component
function QAAccordion() {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const faqData = [
        {
            question: "Làm thế nào để bắt đầu bán hàng trên nền tảng?",
            answer: "Rất đơn giản! Chỉ cần đăng ký tài khoản, xác minh thông tin cá nhân, sau đó bạn có thể tạo danh sách sản phẩm ngay lập tức. Chúng tôi cung cấp hướng dẫn chi tiết từng bước để giúp bạn thiết lập cửa hàng đầu tiên.",
        },
        {
            question: "Phí dịch vụ của nền tảng như thế nào?",
            answer: "Chúng tôi chỉ thu phí khi bạn bán thành công sản phẩm. Phí dịch vụ là 3% trên tổng giá trị đơn hàng, đã bao gồm xử lý thanh toán và bảo vệ giao dịch. Không có phí ẩn hay phí đăng ký hàng tháng.",
        },
        {
            question: "Làm sao để đảm bảo giao dịch an toàn?",
            answer: "Chúng tôi sử dụng hệ thống thanh toán trung gian (escrow), mã hóa SSL 256-bit, và xác minh danh tính người dùng. Tiền thanh toán chỉ được chuyển cho người bán sau khi người mua xác nhận nhận hàng. Nếu có tranh chấp, đội ngũ hỗ trợ sẽ can thiệp để giải quyết công bằng.",
        },
        {
            question: "Tôi có thể bán những loại sản phẩm nào?",
            answer: "Hầu hết các sản phẩm hợp pháp đều được phép bán, bao gồm điện tử, thời trang, gia dụng, sách, đồ chơi, và nhiều hơn nữa. Chúng tôi có danh sách các mặt hàng bị cấm rõ ràng như vũ khí, chất cấm, và hàng giả. Vui lòng xem chính sách để biết chi tiết đầy đủ.",
        },
        {
            question: "Khi nào tôi nhận được tiền sau khi bán hàng?",
            answer: "Đối với người bán mới, tiền sẽ được giải ngân sau 7 ngày kể từ khi người mua xác nhận nhận hàng. Người bán đã xác minh và có lịch sử giao dịch tốt sẽ nhận tiền nhanh hơn (2-3 ngày). Chúng tôi hỗ trợ chuyển khoản qua ngân hàng và ví điện tử.",
        },
        {
            question: "Nếu gặp vấn đề với đơn hàng, tôi phải làm gì?",
            answer: "Trước tiên, hãy liên hệ trực tiếp với người bán/người mua qua hệ thống nhắn tin của chúng tôi. Nếu không giải quyết được, bạn có thể mở ticket hỗ trợ. Đội ngũ của chúng tôi sẽ can thiệp và đưa ra giải pháp công bằng trong vòng 24-48 giờ.",
        },
    ];

    const toggleItem = (index: number) => {
        setOpenItems((prev) =>
            prev.includes(index)
                ? prev.filter((item) => item !== index)
                : [...prev, index]
        );
    };

    return (
        <div className='bg-card rounded-2xl p-8 shadow-lg border mb-12'>
            <h2 className='text-3xl font-bold text-foreground text-center mb-8'>
                Câu Hỏi Thường Gặp (Q&A)
            </h2>
            <div className='space-y-4'>
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className='border border-border rounded-lg overflow-hidden'
                    >
                        <button
                            className='w-full px-6 py-4 text-left bg-card hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between focus:outline-none'
                            onClick={() => toggleItem(index)}
                        >
                            <span className='text-lg font-semibold text-foreground pr-4'>
                                {item.question}
                            </span>
                            <svg
                                className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                                    openItems.includes(index)
                                        ? "rotate-180"
                                        : ""
                                }`}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M19 9l-7 7-7-7'
                                />
                            </svg>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openItems.includes(index)
                                    ? "max-h-96 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <div className='px-6 pb-4 pt-2 text-muted-foreground bg-muted/20'>
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AboutPage() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
            <div className='container mx-auto px-4 py-16 max-w-4xl'>
                {/* Phần giới thiệu chính */}
                <div className='text-center mb-16'>
                    <h1 className='text-5xl font-bold text-foreground mb-6'>
                        Về Chúng Tôi
                    </h1>
                    <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                        Kết nối người mua và người bán trong một nền tảng đáng
                        tin cậy, dễ sử dụng – nơi giao dịch tốt đi cùng trải
                        nghiệm tuyệt vời.
                    </p>
                </div>

                {/* Sứ mệnh */}
                <div className='bg-card rounded-2xl p-8 shadow-lg border mb-12'>
                    <h2 className='text-3xl font-bold text-foreground mb-6'>
                        Sứ Mệnh Của Chúng Tôi
                    </h2>
                    <p className='text-lg text-muted-foreground mb-6'>
                        Chúng tôi tin rằng ai cũng xứng đáng có một cách đơn
                        giản, an toàn và hiệu quả để mua bán trực tuyến. Nền
                        tảng của chúng tôi giúp cá nhân và doanh nghiệp nhỏ tiếp
                        cận khách hàng, khám phá sản phẩm độc đáo và xây dựng
                        kết nối ý nghĩa qua thương mại.
                    </p>
                    <div className='grid md:grid-cols-3 gap-6'>
                        <div className='text-center p-4'>
                            <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-2xl'>🛡️</span>
                            </div>
                            <h3 className='font-semibold text-foreground mb-2'>
                                An Toàn & Bảo Mật
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                Bảo vệ giao dịch với các biện pháp bảo mật tiên
                                tiến
                            </p>
                        </div>
                        <div className='text-center p-4'>
                            <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-2xl'>🌟</span>
                            </div>
                            <h3 className='font-semibold text-foreground mb-2'>
                                Ưu Tiên Chất Lượng
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                Danh sách sản phẩm được chọn lọc với mô tả và
                                đánh giá chi tiết
                            </p>
                        </div>
                        <div className='text-center p-4'>
                            <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <span className='text-2xl'>🤝</span>
                            </div>
                            <h3 className='font-semibold text-foreground mb-2'>
                                Cộng Đồng
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                Xây dựng niềm tin thông qua kết nối chân thật và
                                phản hồi tích cực
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tính năng nổi bật */}
                <div className='bg-card rounded-2xl p-8 shadow-lg border mb-12'>
                    <h2 className='text-3xl font-bold text-foreground mb-6'>
                        Vì Sao Chọn Chúng Tôi?
                    </h2>
                    <div className='grid md:grid-cols-2 gap-8'>
                        <div>
                            <h3 className='text-xl font-semibold text-foreground mb-3'>
                                Dành Cho Người Bán
                            </h3>
                            <ul className='space-y-2 text-muted-foreground'>
                                <li className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-primary rounded-full'></span>
                                    Tạo danh sách sản phẩm dễ dàng với tính năng
                                    kéo-thả ảnh
                                </li>
                                <li className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-primary rounded-full'></span>
                                    Phân tích và theo dõi hiệu suất theo thời
                                    gian thực
                                </li>
                                <li className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-primary rounded-full'></span>
                                    Nhiều tuỳ chọn thanh toán và vận chuyển
                                </li>
                                <li className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-primary rounded-full'></span>
                                    Nhắn tin trực tiếp với khách hàng tiềm năng
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-xl font-semibold text-foreground mb-3'>
                                Dành Cho Người Mua
                            </h3>
                            <ul className='space-y-2 text-muted-foreground'>
                                <li className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-primary rounded-full'></span>
                                    Tìm kiếm và lọc sản phẩm nâng cao
                                </li>
                                <li className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-primary rounded-full'></span>
                                    Mô tả và hình ảnh sản phẩm chi tiết
                                </li>
                                <li className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-primary rounded-full'></span>
                                    Thanh toán an toàn và bảo vệ người mua
                                </li>
                                <li className='flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-primary rounded-full'></span>
                                    Đánh giá người bán và phản hồi từ người dùng
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Thống kê cộng đồng */}
                <div className='bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border mb-12'>
                    <h2 className='text-3xl font-bold text-foreground text-center mb-8'>
                        Cộng Đồng Ngày Càng Lớn Mạnh
                    </h2>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
                        <div>
                            <div className='text-3xl font-bold text-primary mb-2'>
                                10K+
                            </div>
                            <div className='text-sm text-muted-foreground'>
                                Người Dùng Hoạt Động
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-primary mb-2'>
                                50K+
                            </div>
                            <div className='text-sm text-muted-foreground'>
                                Sản Phẩm Đã Bán
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-primary mb-2'>
                                98%
                            </div>
                            <div className='text-sm text-muted-foreground'>
                                Mức Độ Hài Lòng
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-primary mb-2'>
                                24/7
                            </div>
                            <div className='text-sm text-muted-foreground'>
                                Hỗ Trợ Liên Tục
                            </div>
                        </div>
                    </div>
                </div>

                {/* Q&A Accordion Section */}
                <QAAccordion />

                {/* Hỗ trợ liên hệ */}
                <div className='bg-card rounded-2xl p-8 shadow-lg border text-center'>
                    <h2 className='text-3xl font-bold text-foreground mb-4'>
                        Có Thắc Mắc? Chúng Tôi Luôn Sẵn Sàng
                    </h2>
                    <p className='text-muted-foreground mb-6'>
                        Đội ngũ hỗ trợ tận tâm của chúng tôi luôn sẵn sàng giải
                        đáp mọi câu hỏi và mối quan tâm của bạn.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <div className='bg-muted/50 rounded-lg p-4'>
                            <h3 className='font-semibold text-foreground mb-1'>
                                Hỗ Trợ Qua Email
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                support@marketplace.com
                            </p>
                        </div>
                        <div className='bg-muted/50 rounded-lg p-4'>
                            <h3 className='font-semibold text-foreground mb-1'>
                                Hỗ Trợ Qua Điện Thoại
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                1-800-MARKETPLACE
                            </p>
                        </div>
                        <div className='bg-muted/50 rounded-lg p-4'>
                            <h3 className='font-semibold text-foreground mb-1'>
                                Trò Chuyện Trực Tiếp
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                                Hỗ trợ 24/7
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
