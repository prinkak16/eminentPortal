import * as React from 'react';
import usePagination from '@mui/material/usePagination';
import { styled } from '@mui/material/styles';
import {getData} from "../../../../api/eminentapis/endpoints";
import {useEffect, useState} from "react";

const List = styled('ul')({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
});

export default function UsePagination() {
    const [listData, setListData] = useState([])
    const [dataList, setDataList] = useState([]);
    const { items } = usePagination({
        count: listData?.data.data.members.length,
    });

    useEffect(() => {
        getData().then(res => {
            setListData(res);
        })
        dataList.push(listData?.data.members);
        console.log(dataList);
    }, []);

    return (
        <nav>
            <List>
                {items.map(({ page, type, selected, ...item }, index) => {
                    let children = null;

                    if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                        children = '…';
                    } else if (type === 'page') {
                        children = (
                            <button
                                type="button"
                                style={{
                                    fontWeight: selected ? 'bold' : undefined,
                                }}
                                {...item}
                            >
                                {page}
                            </button>
                        );
                    } else {
                        children = (
                            <button type="button" {...item}>
                                {type}
                            </button>
                        );
                    }

                    return <li key={index}>{children}</li>;
                })}
            </List>
        </nav>
    );
}