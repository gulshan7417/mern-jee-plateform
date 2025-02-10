import Image from 'next/image';

export default function PlatformPreview() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-2xl">
      <h3 className="text-2xl font-semibold text-blue-700 mb-4">Platform Preview</h3>
      <p className="text-blue-500 mb-4">
        Get a glimpse of our intuitive test-taking interface designed to simulate real exam conditions.
      </p>
      <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-md">
        <Image
          src="https://researchleap.com/wp-content/uploads/2020/03/ed-tech1553237040995.jpg"
          alt="Platform Preview"
          width={900}
          height={500}
          layout="responsive"
          className="rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        />
      </div>
    </div>
  );
}
