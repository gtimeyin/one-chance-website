import { verifySession } from "@/lib/dal";
import { getCustomerById } from "@/lib/woocommerce";
import AddressForm from "@/components/account/AddressForm";
import { updateBillingAddress, updateShippingAddress } from "@/app/actions/account";

const emptyAddress = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "",
  phone: "",
};

export default async function AddressesPage() {
  const session = await verifySession();
  const customer = await getCustomerById(session.customerId);

  const billing = customer?.billing || emptyAddress;
  const shipping = customer?.shipping || emptyAddress;

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-['Barlow_Condensed'] text-[40px] font-[800] leading-[1.1] text-neutral-800 uppercase -tracking-[0.02em]">
        ADDRESSES
      </h1>

      <AddressForm title="Billing Address" address={billing} action={updateBillingAddress} />

      <div className="h-px w-full bg-neutral-200" />

      <AddressForm title="Shipping Address" address={shipping} action={updateShippingAddress} />
    </div>
  );
}
