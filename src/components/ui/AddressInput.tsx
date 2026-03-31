import { Input } from "@/components/ui/Input";

export interface AddressData {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

interface AddressInputProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
  prefix?: string;
  autoFocus?: boolean;
}

export function AddressInput({ value, onChange, prefix = "", autoFocus }: AddressInputProps) {
  function update(field: keyof AddressData, v: string) {
    onChange({ ...value, [field]: v });
  }

  function handleZipChange(raw: string) {
    // Allow only digits and a single hyphen for ZIP+4 format
    const cleaned = raw.replace(/[^\d-]/g, "");
    update("zip", cleaned);
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-espresso mb-2">
        Delivery Address
      </legend>
      <div className="flex flex-col gap-3">
        <Input
          label="Street Address"
          type="text"
          required
          autoFocus={autoFocus}
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
          <div className="col-span-1 sm:col-span-1">
            <div className="flex flex-col gap-1">
              <label htmlFor={`${prefix}state`} className="text-sm font-medium text-espresso">
                State<span className="text-crust ml-1">*</span>
              </label>
              <select
                id={`${prefix}state`}
                required
                autoComplete={`${prefix}address-level1`}
                value={value.state}
                onChange={(e) => update("state", e.target.value)}
                className="rounded-lg border border-stone bg-white px-2 py-2.5 text-espresso text-sm focus:border-crust focus:outline-none focus:ring-2 focus:ring-crust/20 transition-colors"
              >
                <option value="">--</option>
                {US_STATES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-2">
            <Input
              label="ZIP"
              type="text"
              required
              autoComplete={`${prefix}postal-code`}
              value={value.zip}
              onChange={(e) => handleZipChange(e.target.value)}
              placeholder="10001"
              maxLength={10}
              inputMode="numeric"
              pattern="^\d{5}(-\d{4})?$"
              title="Enter a 5-digit ZIP code (e.g. 10001) or ZIP+4 (e.g. 10001-1234)"
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
