import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
// import CheckoutConfirmPage from "./CheckoutConfirmPage";
// import { useCartStore } from "@/store/useCartStore";
// import { CartItem } from "@/types/cartType";
import HeroImage from "./../assets/hero_pizza.png";
import CheckoutConfirmPage from "./CheckoutConfirmPage";

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  //   const { cart, decrementQuantity, incrementQuantity } = useCartStore();

  //   let totalAmount = cart.reduce((acc, ele) => {
  //     return acc + ele.price * ele.quantity;
  //   }, 0);
  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10">
      <div className="flex justify-end">
        <Button variant="link">Clear All</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Avatar>
                <AvatarImage
                  src={HeroImage}
                  //   src={item.image}
                  alt=""
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>
              Pizza
              {/* {item.name} */}
            </TableCell>
            <TableCell>{/* {item.price} */} 650</TableCell>
            <TableCell>
              <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                <Button
                  // onClick={() => decrementQuantity(item._id)}
                  size={"icon"}
                  variant={"outline"}
                  className="rounded-full bg-gray-200"
                >
                  <Minus />
                </Button>
                <Button
                  size={"icon"}
                  className="font-bold border-none"
                  disabled
                  variant={"outline"}
                >
                  {/* {item.quantity}  */}5
                </Button>
                <Button
                  //   onClick={() => incrementQuantity(item._id)}
                  size={"icon"}
                  className="rounded-full bg-orange hover:bg-hoverOrange"
                  variant={"outline"}
                >
                  <Plus />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              5*7
              {/* {item.price * item.quantity} */}
            </TableCell>
            <TableCell className="text-right">
              <Button size={"sm"} className="bg-orange hover:bg-hoverOrange">
                Remove
              </Button>
            </TableCell>
          </TableRow>
          {/* {cart.map((item: CartItem) => (
           
          ))} */}
        </TableBody>
        <TableFooter>
          <TableRow className="text-2xl font-bold">
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">
              1500
              {/* {totalAmount} */}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-end my-5">
        <Button
          onClick={() => setOpen(true)}
          className="bg-orange hover:bg-hoverOrange rounded"
        >
          Proceed To Checkout
        </Button>
      </div>
      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
