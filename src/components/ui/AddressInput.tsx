import { Input } from "@/components/ui/Input";

export interface AddressData {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressInputProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
  prefix?: string;
}

export function AddressInput({ value, onChange, prefix = "" }: AddressInputProps) {
  function update(field: keyof AddressData, v: string) {
    onChange({ ...value, [field]: v });
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-navy mb-2">
        Delivery Address
      </legend>
      <div className="flex flex-col gap-3">
        <Input
          label="Street Address"
          type="text"
          required
          autoComplete={`${prefix}street-address`}
          value={value.street}
          onChange={(e) => update("street", e.target.value)}
          placeholder="123 Main St"
        />
        <Input
          label="Apt / Suite / Unit"
          type="text"
          autoComplete={`${prefix}address-line2`}
          value={value.apt}
          onChange={(e) => update("apt", e.target.value)}
          placeholder="Apt 4B"
        />
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-3">
            <Input
              label="City"
              type="text"
              required
              autoComplete={`${prefix}address-level2`}
              value={value.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="New York"
            />
          </div>
          <div className="col-span-1">
            <Input
              label="State"
              type="text"
              required
              autoComplete={`${prefix}address-level1`}
              value={value.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="NY"
              maxLength={2}
            />
          </div>
          <div className="col-span-2">
            <Input
              label="ZIP"
              type="text"
              required
              autoComplete={`${prefix}postal-code`}
              value={value.zip}
              onChange={(e) => update("zip", e.target.value)}
              placeholder="10001"
              maxLength={10}
              inputMode="numeric"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}

export function formatAddress(addr: AddressData): string {
  const line1 = addr.apt ? `${addr.street}, ${addr.apt}` : addr.street;
  return `${line1}, ${addr.city}, ${addr.state} ${addr.zip}`;
}
