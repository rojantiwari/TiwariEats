import { Timer } from "lucide-react";

import { Badge } from "./ui/badge";
import AvailableMenu from "./AvailableMenu";
const RestaurantDetail = () => {
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">
        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            // src={singleRestaurant?.imageUrl || "Loading..."}
            src="https://th.bing.com/th/id/R.346dbb0f197b700a2d2bee708ddb747a?rik=A4cHs8Lj8BVSeQ&riu=http%3a%2f%2fi1.nyt.com%2fimages%2f2015%2f12%2f16%2fdining%2f16TOPDISHES-slide-F26S%2f16TOPDISHES-slide-F26S-superJumbo.jpg&ehk=zrvQpjYRLA9Xe6yMP%2bAXXw%2f71j%2beNO62fFHziJYWn50%3d&risl=&pid=ImgRaw&r=0"
            alt="res_image"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">
            <h1 className="font-medium text-xl">Restaurant Name</h1>
            <div className="flrx gap-2 my-2">
              {["biryani", "mutton curry", "pizza"].map(
                (cuisine: string, idx: number) => (
                  <Badge
                    key={idx}
                    className="font-medium px-2 py-1 rounded-full shadow-sm"
                  >
                    {cuisine}
                  </Badge>
                )
              )}
            </div>
            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h1 className="flex items-center gap-2 font-medium">
                  Delivery Time:{" "}
                  <span className="text-[#D19254]">
                    {/* {singleRestaurant?.deliveryTime || "NA"}  */}
                    50 mins
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <AvailableMenu />
      </div>
    </div>
  );
};
export default RestaurantDetail;
