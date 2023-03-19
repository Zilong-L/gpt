import { useRouter } from 'next/router';
import Home from './Home';
import SideList from '../SideList'
import SplitView from '../SplitView'
import Dialog from './Dialog';
import { useLocalStorage}from '../api/useLocalStorage'
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const defaultStorageValue = {
  "data": [
    { id: uuidv4(), label: 'Example' },
    { id: uuidv4(), label: 'Chat' },
    { id: uuidv4(), label: 'Coding' },
  ]
};

export default function LabelPage() {
  const router = useRouter();
  const { label } = router.query;
  const [items, setItems] = useState(defaultStorageValue)
  const [tempItems, setTempItems] = useState(items)
  
  useEffect(() => {
    let  storageItems = localStorage.getItem('gpt-labels')
    if (storageItems == null) {
      localStorage.setItem('gpt-labels',JSON.stringify(items))
      return;
    }
    const itemJson = JSON.parse(storageItems)
    if (itemJson != null) {
      setItems(itemJson)
    }
    
  },[])
 

  return <SplitView leftContent={<SideList items={items['data']} />} rightContent={label ? <Dialog /> : <Home />} />
}


