'use client'; // Помечаем как клиентский компонент

import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useRouter } from 'next/navigation';

const brands = ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Huawei'];

const BrandSelect = ({ selectedBrand }) => {
  const router = useRouter();

  const handleBrandChange = (event) => {
    const selectedValue = event.target.value;
    router.push(`/?brand=${selectedValue}`);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="brand-label">Выберите бренд</InputLabel>
      <Select
        labelId="brand-label"
        value={brands.includes(selectedBrand) ? selectedBrand : ''}
        onChange={handleBrandChange}
      >
        {brands.map((brand) => (
          <MenuItem key={brand} value={brand}>
            {brand}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BrandSelect;
