import Link from "next/link"

const WHATSAPP_NUMBER = "5511940793593"
const WHATSAPP_MESSAGE = "Ola! Vim pelo site da Smoke Pods e gostaria de tirar uma duvida."

export function WhatsappFloatButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
    >
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 fill-current"
        aria-hidden="true"
      >
        <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.34.652 4.527 1.785 6.392L4 29l7.81-1.748A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm0 21.7c-1.91 0-3.69-.55-5.197-1.498l-.373-.225-4.633 1.037 1.06-4.518-.246-.39A9.65 9.65 0 0 1 6.3 15c0-5.354 4.353-9.7 9.704-9.7 5.353 0 9.704 4.346 9.704 9.7s-4.351 9.7-9.704 9.7zm5.317-7.27c-.29-.146-1.717-.846-1.984-.943-.266-.097-.46-.146-.654.146-.193.291-.75.943-.92 1.137-.17.194-.34.218-.63.073-.29-.146-1.225-.451-2.333-1.437-.862-.768-1.444-1.717-1.613-2.008-.169-.291-.018-.448.128-.593.131-.13.29-.34.435-.51.146-.17.193-.291.29-.485.097-.194.048-.364-.024-.51-.073-.146-.654-1.575-.897-2.158-.236-.567-.477-.49-.654-.5l-.557-.01c-.193 0-.508.073-.774.364-.266.291-1.016.993-1.016 2.422 0 1.43 1.04 2.81 1.185 3.004.146.194 2.05 3.13 4.967 4.39.694.3 1.235.479 1.657.613.696.221 1.33.19 1.83.115.558-.083 1.717-.702 1.96-1.38.242-.679.242-1.26.17-1.38-.073-.122-.266-.194-.557-.34z" />
      </svg>
    </Link>
  )
}
