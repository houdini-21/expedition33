import LoginWithGoogle from "@/components/auth/LoginWithGoogle";

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-dvh">
        <aside className="hidden md:flex items-center justify-center p-10 lg:p-12 bg-gradient-to-br from-blue-600 to-blue-500 text-white">
          <div className="max-w-md">
            <div className="mb-6">
              <svg
                className="h-12 w-12"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-3xl lg:text-4xl font-semibold leading-tight">
              Bookings made simple
            </h2>
            <p className="mt-3 text-white/90 lg:text-lg">
              Manage your appointments effortlessly with our intuitive booking
            </p>
          </div>
        </aside>

        <section className="flex items-center justify-center px-4 sm:px-6 md:px-8">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl  p-6 sm:p-8">
            <header className="mb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12">
                  <svg
                    className="text-blue-500  h-full w-full"
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 ">
                Welcome to Bookings
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 ">
                Please log in to continue
              </p>
              <p className="mt-3 text-xs sm:text-sm text-gray-600 font-medium italic">
                Men trip not on mountains, but they stumble upon stones
              </p>
            </header>

            <LoginWithGoogle />
          </div>
        </section>
      </div>
    </main>
  );
}
