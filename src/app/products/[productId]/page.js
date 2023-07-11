'use client'
import React from 'react';
import { useParams } from 'next/navigation';

function ProductDetails(props) {
    const params = useParams() ; 
    return (
        <div>
            {`product details ${params.productId}`}
        </div>
    );
}

export default ProductDetails;