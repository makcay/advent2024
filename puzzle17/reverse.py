import numpy as np

def reverse(p, result):
    '''
    2,4, 1,2, 7,5, 1,3, 4,3, 5,5, 0,3, 3,0
    b = a % 8
    b = b ^ 2
    c = a >> b
    b = b ^ 3
    b = b ^ c
    out = b % 8
    a = a >> 3
    goto 0
    '''
    if (len(p)==0):
        return result
    
    for x in range(8):
        a = result<<3 | x
        b = a % 8
        b = b ^ 2
        c = a >> b
        b = b ^ 3
        b = b ^ c
        if (b%8 == p[-1]):
            remainingProgram = p[:-1]
            res =  reverse(remainingProgram, a)
            if (not res):
                continue
            return res
        

program = np.array(list(map(int,"2,4,1,2,7,5,1,3,4,3,5,5,0,3,3,0".split(","))))
print(reverse(program,0))

