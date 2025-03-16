import { assets } from "../assets/assets";

const Privacy = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          PRIVACY <span className="text-gray-700 font-medium">POLICY</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.privacy_icon} alt="Privacy" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            At Prescripto, we prioritize your privacy and security. This Privacy
            Policy outlines how we collect, use, and protect your personal data
            while ensuring transparency in our practices.
          </p>
          <b className="text-gray-800">Information We Collect</b>
          <p>
            We collect essential data such as your name, contact details,
            medical history, and payment information to provide a seamless
            healthcare experience.
          </p>
          <b className="text-gray-800">How We Use Your Information</b>
          <p>
            Your data is used to facilitate appointment bookings, securely store
            medical records, and enhance our platform based on your feedback.
          </p>
          <b className="text-gray-800">Your Rights</b>
          <p>
            You have full control over your personal data, including the right
            to access, update, or request deletion of your information.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          DATA <span className="text-gray-700 font-semibold">SECURITY</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20 gap-4">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Strict Security Measures:</b>
          <p>
            We implement industry-standard security protocols to safeguard your
            data from unauthorized access.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Encrypted Transactions:</b>
          <p>
            Payment details are securely encrypted to ensure safe transactions.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>User Control:</b>
          <p>
            You have the ability to manage your data and privacy settings at any
            time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
