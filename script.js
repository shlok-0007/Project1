function createMatrixInput(dimension = 3) {
    const n = parseInt(document.getElementById('dimension').value) || dimension;
    const matrixInputDiv = document.getElementById('matrix-input');
    matrixInputDiv.innerHTML = '';
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            matrixInputDiv.innerHTML += `<input type="number" id="a${i}${j}" value="">`;
        }
        matrixInputDiv.innerHTML += '<br>';
    }
}

// Initialize a default 3x3 matrix input on first load
window.onload = () => {
    document.getElementById('dimension').value = 3;  // Set default dimension to 3
    createMatrixInput(3);  // Initialize with 3x3 matrix by default
};

function calculateLDU() {
    const n = parseInt(document.getElementById('dimension').value);
    
    // Create A matrix manually without using Array.from
    const A = [];
    for (let i = 0; i < n; i++) {
        A[i] = [];
        for (let j = 0; j < n; j++) {
            A[i][j] = parseFloat(document.getElementById(`a${i}${j}`).value);
        }
    }

    // Initialize L and U matrices without using Array.from
    const L = [];
    const U = [];
    for (let i = 0; i < n; i++) {
        L[i] = [];
        U[i] = [];
        for (let j = 0; j < n; j++) {
            U[i][j] = A[i][j]; // Copy A to U
            L[i][j] = 0; // Initialize L as zero
        }
        L[i][i] = 1; // Set diagonal of L to 1
    }

    let steps = '<p><u>Gaussian Elimination Steps with Elimination Matrices</u></p>';
    const eliminationMatrices = [];
    let cumulativeProduct = [];
    for (let i = 0; i < n; i++) {
        cumulativeProduct[i] = [];
        for (let j = 0; j < n; j++) {
            cumulativeProduct[i][j] = (i === j ? 1 : 0); // Identity matrix
        }
    }
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const factor = U[j][i] / U[i][i];
            L[j][i] = factor;

            // Create elimination matrix for this step
            const E = [];
            for (let k = 0; k < n; k++) {
                E[k] = [];
                for (let l = 0; l < n; l++) {
                    E[k][l] = (k === l ? 1 : 0); // Identity matrix
                }
            }
            E[j][i] = -factor;
            eliminationMatrices.push(E);

            steps += `<p>Elimination Matrix of row ${j + 1}, column ${i + 1} [E${j + 1}${i + 1}]:</p>`;
            steps += displayMatrix(E) + '<br>';

            // Update cumulative product of elimination matrices and display
            cumulativeProduct = multiplyMatrices(cumulativeProduct, E);
            steps += `<p>Cumulative Product after step ${i + j}:</p>`;
            steps += displayMatrix(cumulativeProduct) + '<br>';

            // Perform row elimination on U
            for (let k = 0; k < n; k++) {
                U[j][k] -= factor * U[i][k];
            }
        }
    }

    // Move the "Matrix U before extracting diagonal entry" step to after all row eliminations
    steps += `<h4>Matrix U [Final Cumulative Product * A]</h4>`;
    steps += displayMatrix(U) + '<br>';

    // Extract D matrix from U and normalize U to make diagonal entries of D
    const D = [];
    for (let i = 0; i < n; i++) {
        D[i] = [];
        for (let j = 0; j < n; j++) {
            D[i][j] = 0;
        }
    }
    
    for (let i = 0; i < n; i++) {
        D[i][i] = U[i][i];

        // Normalize the current row in U by dividing each element by U[i][i]
        for (let j = 0; j < n; j++) {
            U[i][j] /= D[i][i];
        }
        U[i][i] = 1; // Set the diagonal of U to 1 explicitly
    }

    steps += "<hr><h3><u>Final L, D, and U' Matrices</u></h3>";
    steps += `<p><strong>L Matrix [Inverse of Final Cumulative Product]:</strong><br>${displayMatrix(L)}</p>`;
    steps += `<p><strong>D Matrix [Diagonal Matrix of U] :</strong><br>${displayMatrix(D)}</p>`;
    steps += `<p><strong>U' Matrix [Diagonal of U is converted to identity]:</strong><br>${displayMatrix(U)}</p>`;

    // Verify that L * D * U = A
    const LD = multiplyMatrices(L, D);
    const LDU = multiplyMatrices(LD, U);

    steps += '<h3><u>Verification</u></h3>';
    steps += `<p><strong>L * D * U' Matrix:</strong><br>${displayMatrix(LDU)}</p>`;
    steps += `<p><strong>Original Matrix A:</strong><br>${displayMatrix(A)}</p>`;

    document.getElementById('output').innerHTML = steps;
}

function displayMatrix(matrix) {
    let result = '';
    for (let i = 0; i < matrix.length; i++) {
        result += matrix[i].map(value => value.toFixed(2)).join('\t') + '<br>';
    }
    return result;
}

function multiplyMatrices(A, B) {
    const result = [];
    for (let i = 0; i < A.length; i++) {
        result[i] = [];
        for (let j = 0; j < B[0].length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < B.length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}
