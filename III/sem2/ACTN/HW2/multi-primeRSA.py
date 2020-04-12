import sys
import time
import sympy


def get_prime_number(*args):
    number = sympy.randprime(pow(2, 512), pow(2, 523))

    while number in args:
        number = sympy.randprime(pow(2, 512), pow(2, 523))

    return number


def gcd(a, b):
    if b == 0:
        return a

    return gcd(b, a % b)


def generate_pqr():
    p = get_prime_number()
    q = get_prime_number(p)
    r = get_prime_number(p, q)

    return p, q, r


def get_message(path=''):
    with open(path, "rb") as fd:
        message = fd.read()

    return int.from_bytes(message, byteorder=sys.byteorder)


def write_to_file(path='', content=''):
    with open(path, "w") as fd:
        fd.write(str(content))


def get_encrypted_message(path='', n=0, e=0):
    message = get_message(path)

    encrypted = pow(message, e, n)
    write_to_file("encrypted.txt", encrypted)

    return encrypted


def print_these(**kwargs):
    for key, value in kwargs.items():
        print(key, " - ", value)


def decrypt(y, d, n):
    begin = time.time()
    x = pow(y, d, n)
    end = time.time() - begin

    return x, end


def decrypt_garner(y, d, p, q, r):
    begin = time.time()

    mp = pow(y % p, d % (p - 1), p)
    mq = pow(y % q, d % (q - 1), q)
    mr = pow(y % r, d % (r - 1), r)

    x = mp
    alpha = (((mq - mp) % q) * sympy.mod_inverse(mp, q)) % q
    x += alpha * mp
    alpha = (((mr - mp) % r) * sympy.mod_inverse(mp * mq, r)) % r
    x += alpha * mp * mq

    end = time.time() - begin

    return x, end


def multiprime_RSA(iterations=10):
    average_time = 0

    generate_pqr()

    for iteration in range(iterations):
        print("Iteration: ", iteration)

        p, q, r = generate_pqr()

        e = pow(2, 16) + 1
        n = p * q * r
        phi_n = (p - 1) * (q - 1) * (r - 1)

        condition = gcd(e, phi_n)
        while condition != 1:
            p, q, r = generate_pqr()
            n = p * q * r
            phi_n = (p - 1) * (q - 1) * (r - 1)
            condition(e, phi_n)

        d = sympy.mod_inverse(e, phi_n)
        y = get_encrypted_message("message.txt", n, e)

        # print_these(p=p, q=q, r=r, e=e, d=d, y=y, m=get_message(path="message.txt"))

        x_decrypt, time_decrypt = decrypt(y, d, n)
        x_decrypt_garner, time_decrypt_garner = decrypt_garner(y, d, p, q, r)

        average_time += time_decrypt / time_decrypt_garner

        print("\ty decrypted with python library:", x_decrypt)
        print("\ty decrypted with Garner:", x_decrypt_garner)
        print("\tgarner vs python function time:", time_decrypt / time_decrypt_garner)
        print()

    print("Average time: ", average_time / 10)


multiprime_RSA()
