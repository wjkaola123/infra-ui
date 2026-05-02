import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  multiple?: boolean;
  placeholder?: string;
}

export function Select({ label, value, onChange, options, multiple = true, placeholder = '选择...' }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Listbox value={value} onChange={onChange} multiple={multiple}>
        <div className="relative">
          <Listbox.Button className="w-full px-3 py-2 text-left border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50">
            {value.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              <span>{value.length} 项已选</span>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `cursor-pointer px-3 py-2 text-sm ${active ? 'bg-gray-100' : ''}`
                  }
                >
                  {() => (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={value.includes(option.value)}
                        onChange={() => {}}
                        className="w-4 h-4 rounded border-gray-300 text-primary"
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
