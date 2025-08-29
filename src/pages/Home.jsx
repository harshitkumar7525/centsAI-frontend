import FeaturesTabs from "../components/Home/FeaturesTabs";

export default function Home() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-400">
            Track Smarter, Not Harder
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance">
            Everything you need to manage your expenses
          </p>
          <p className="mt-6 text-lg/8 text-gray-300">
            Just tell CentsAI what you spent in simple language, like "Rs. 110
            spent on food", and let AI handle the rest. Get insights,
            comparisons, and charts that make your financial life simpler.
          </p>
        </div>
        <FeaturesTabs />
      </div>
    </div>
  );
}
