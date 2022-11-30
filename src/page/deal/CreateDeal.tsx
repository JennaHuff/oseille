import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { addDeal, DealInput, store } from '../../backend';
import { Button } from '../../component/form/button/Button';

export function CreateDeal() {
  const { customerId = '' } = useParams();
  const { products, customers } = useSnapshot(store);
  const [count, setCount] = useState([0]);
  const { register, handleSubmit } = useForm<DealInput>();

  const onSubmit: SubmitHandler<DealInput> = (d) => {
    console.log(d);
    addDeal(d);
  };

  return (
    <div>
      CreateDeal
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register('customerId')}>
          {customers.map((customer) => {
            return (
              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.name}
              </option>
            );
          })}
        </select>
        <div>
          {count.map((index) => {
            return (
              <div key={index}>
                <select {...register(`products.${index}.productId`)}>
                  {products.map((product) => {
                    return (
                      <option
                        value={product._id}
                        key={product._id}
                      >
                        {product.name}
                      </option>
                    );
                  })}
                </select>
                <input
                  type="number"
                  {...register(`products.${index}.quantity`)}
                />
              </div>
            );
          })}
          <Button
            label={'ajouter produit'}
            onClick={() => {
              const maxIndex = Math.max(...count);
              setCount((prev) => {
                return [...prev, maxIndex + 1];
              });
            }}
          />
        </div>

        <input
          type="submit"
          value="Valider"
        />
      </form>
    </div>
  );
}
