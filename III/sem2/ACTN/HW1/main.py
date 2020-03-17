
def get_binar():
    is_number = False
    
    with open("input.txt", "r") as fd:
        content = fd.read()
        
        if content.isdigit():
            binary = int(content)
            is_number = True
        else:
            binary = ''.join(format(ord(character), "b") for character in content)

    return binary, is_number

def get_binary_text():
    with open("input.txt", "r") as fd:
        content = fd.read()
        
        binary = ''.join(format(ord(character), "b") for character in content)
    
    return binary, False
   
def get_binary_number():
    with open("input.txt", "r") as fd:
        content = fd.read()
        
        binary = int(content)
        
    return binary, True
    
    
def to_base(number, prime):
    reminders = []

    while number:
        reminders.append(number % prime)
        number //= prime

    reminders.reverse()
    return reminders
    

def compute_polinom(x, constants):
    polinom = None
    
    for constant in constants:
        if polinom is None:
            polinom = constant
        else:
            polinom += constant
        
        polinom *= x
    
    return polinom
    

def encode(p, s = 1):
    binar, is_number = get_binary_number()
    
    if is_number:
        coef_array = to_base(binar, p)
  #  else:
  #      coef_array = [int(binar[i: i + p - 1], 2) % p for i in range(0, len(binar), p - 1)]
  #      coef_array.reverse()
    
    result = [compute_polinom(index, coef_array) % p for index in range(1, len(coef_array) + 2 * s + 2)]
    print("coef: ", coef_array)
    
    return result, is_number

p = 11
output, is_number = encode(p)

print(output)
