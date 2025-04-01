import { useState } from "react";
import axios from "axios";
import Navbar from "./components/nav-bar";
import productLinks from "./utils/product-links";

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${backendUrl}`, { url });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching product info", error);

      if (error.response && error.response.data) {
        setError(
          error.response?.data.message ||
            "Something went wrong, Please try with another link!"
        );
      } else {
        setError("Something went wrong, Please try with another link!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#efefef] w-full min-h-screen flex">
      <div className="w-3/4 ">
        <Navbar />
        <div className="flex flex-col gap-4  justify-center mx-10 my-10">
          <p className="text-center">
            Hello, with SmartScrape you can get{" "}
            <span className="font-bold">AI summarized</span> review and complete
            product details of any <br /> India Smart TV from amazon, including
            bank offers and full specifications.
          </p>

          <div className="flex gap-4 justify-center ">
            <input
              type="text"
              className="w-2/3 p-2 bg-white border border-gray-300 rounded-lg overflow-x-auto whitespace-nowrap break-words"
              placeholder="Paste Smart TV link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div>
              <button
                className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-black/80 transition-all"
                onClick={handleSubmit}
              >
                Get Product Info
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-4 mx-10 text-center">
          {error && (
            <p className="text-center py-2 text-sm text-red-500 border-1 border-red-600 bg-red-100 rounded-md px-20">
              {error}
            </p>
          )}
        </div>

        <div className="">
          {loading ? (
            <div className="animate-pulse space-y-4 bg-white shadow border border-[#e3e3e3] mx-10 rounded-lg p-6">
              <div className="h-6 bg-gray-300 rounded w-2/3" />
              <div className="h-4 bg-gray-300 rounded w-1/3" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          ) : data ? (
            <div>
              <div className="bg-white shadow border border-[#e3e3e3] mx-10 rounded-lg p-6 mb-6">
                <div className="">
                  <h3 className="text-xl font-semibold mb-2">
                    Summarized AI Review
                  </h3>

                  <p className="text-sm text-gray-700 italic border-b border-gray-300 pb-2 mb-4">
                    {data.summary.sentiment}
                  </p>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-semibold text-green-700 mb-2">
                        Pros
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-800">
                        {data.summary.pros.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-md font-semibold text-red-700 mb-2">
                        Cons
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-800">
                        {data.summary.cons.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow border border-[#e3e3e3] mx-10 rounded-lg p-6">
                <h2 className="text-xl font-bold">{data.name}</h2>
                <p className="text-sm flex items-center mt-2">
                  <span className="text-yellow-500 text-lg mr-1">
                    {"★".repeat(Math.round(data.rating))}
                  </span>
                  <span className="text-gray-600">
                    {data.rating} ({data.numRatings})
                  </span>
                </p>

                <div className="flex gap-4 mt-2">
                  <p className="text-red-600 font-semibold">{data.discount}</p>
                  <p className="font-bold">{data.sellingPrice}</p>
                </div>
                <p className="text-gray-500 line-through italic border-b border-gray-300 pb-2">
                  {data.actualPrice}
                </p>

                {data.images && data.images.length > 0 && (
                  <div>
                    <h2 className="text-lg mt-2 font-bold">
                      Images of the product.
                    </h2>
                    <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
                      {data.images.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={`Product image ${idx + 1}`}
                          className="h-40 w-auto rounded-lg border border-gray-200 shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {data.bankOffers.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg">Bank Offers</h3>
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {data.bankOffers.map((offer, idx) => (
                        <div
                          key={idx}
                          className="min-w-[200px] bg-[#f9f9f9] p-3 rounded-md border"
                        >
                          {offer}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.productInfo && data.productInfo.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Product Specifications
                    </h3>
                    <div className="overflow-auto">
                      <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                        <tbody>
                          {data.productInfo.map((item, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td className="px-4 py-2 font-medium border border-gray-200 w-1/3 text-gray-800">
                                {item.key}
                              </td>
                              <td className="px-4 py-2 border border-gray-200 text-gray-700">
                                {item.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="font-semibold text-lg">Reviews</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {data.reviews.map((review, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold">{review.name}</p>
                          <span className="text-yellow-500">
                            {"★".repeat(review.rating)}
                          </span>
                        </div>
                        <p className="font-semibold">{review.title}</p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                        <p className="mt-2 text-sm">{review.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden"></div>
          )}
        </div>
      </div>

      <div className="w-1/4 min-h-screen bg-white shadow border border-[#e3e3e3] rounded-lg p-4">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">
          Quick Links
        </h3>
        <ul className="space-y-2">
          {productLinks.map((link, i) => (
            <li key={i}>
              <button
                className="text-blue-600 underline text-sm text-left"
                onClick={() => {
                  setUrl(link);
                  handleSubmit();
                }}
              >
                Product {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
