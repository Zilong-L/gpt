import { useRouter } from 'next/router';
import Home from './Home';
import SideList from '../SideList'
import SplitView from '../SplitView'
import Dialog from './Dialog';
import { useLocalStorage } from '../api/useLocalStorage'
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';




export default function LabelPage() {
  const router = useRouter();
  const { label } = router.query;
  const [items, setItems] = useState([])

  useEffect(() => {
    let storageItems = localStorage.getItem('gpt-labels')
    if (storageItems == null) {
      localStorage.setItem('gpt-labels', JSON.stringify(items))
      return;
    }
    const itemJson = JSON.parse(storageItems)
    if (itemJson != null) {
      setItems(itemJson)
    }

  }, [])


  return <SplitView leftContent={<SideList items={items} setItems={setItems} />} rightContent={label ? <Dialog /> : <Home />} />
}


