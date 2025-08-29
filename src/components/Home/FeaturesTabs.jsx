import { features } from "./features";

function FeaturesTabs() {
  return (
    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
        {features.map((feature) => (
          <div key={feature.name} className="relative pl-16">
            <dt className="text-base/7 font-semibold text-white">
              <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-500">
                <feature.icon
                  aria-hidden="true"
                  className="size-6 text-white"
                />
              </div>
              {feature.name}
            </dt>
            <dd className="mt-2 text-base/7 text-gray-400">
              {feature.description}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default FeaturesTabs;
